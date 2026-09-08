/**
 * Componente de UI: Captura de formulario, validación local y renderizado de respuestas
 */
import { ApiService } from '../services/apiService.js';

export class BookingForm {
    constructor() {
        this.apiService = new ApiService();
        this.form = document.getElementById('booking-form');
        this.alertBox = document.getElementById('alert-message');
        this.bookingSection = document.getElementById('booking-section');
        this.confirmationSection = document.getElementById('confirmation-section');
        
        this.initEvents();
    }

    initEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Limpiar errores visuales mientras el usuario escribe
        this.form.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => this.clearInputError(input));
        });

        // Botón para hacer una nueva reserva
        document.getElementById('reset-booking-btn')?.addEventListener('click', () => this.resetFormView());
    }

    // Validaciones del lado del Cliente (UX Inmediata)
    validateForm(data) {
        let isValid = true;

        if (!data.userName.trim()) {
            this.showInputError('userName', 'El nombre es obligatorio.');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.userEmail.trim() || !emailRegex.test(data.userEmail)) {
            this.showInputError('userEmail', 'Ingrese un correo electrónico válido.');
            isValid = false;
        }

        if (!data.date) {
            this.showInputError('date', 'Seleccione una fecha.');
            isValid = false;
        }

        if (!data.time) {
            this.showInputError('time', 'Seleccione un horario.');
            isValid = false;
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.hideAlert();

        // 1. Extraer datos del formulario
        const formData = new FormData(this.form);
        const payload = {
            userName: formData.get('userName'),
            userEmail: formData.get('userEmail'),
            date: formData.get('date'),
            time: formData.get('time')
        };

        // 2. Validar localmente antes de invocar la API
        if (!this.validateForm(payload)) return;

        // 3. Activar estado de carga (UI Feedback)
        this.setLoading(true);

        try {
            // 4. Llamada al servicio HTTP
            const response = await this.apiService.createBooking(payload);
            
            // 5. Renderizar éxito y temporizador (BR-001)
            this.renderSuccessView(response);
        } catch (error) {
            // 6. Renderizar error proveniente del backend (BR-002, BR-005, etc.)
            this.showAlert(error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Auxiliares de Interfaz Gráfica (UI Helpers)
    showInputError(fieldName, message) {
        const input = document.getElementById(fieldName === 'date' || fieldName === 'time' ? `booking${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}` : fieldName);
        const errorSpan = document.getElementById(`error-${fieldName}`);
        
        if (input) input.classList.add('invalid');
        if (errorSpan) errorSpan.textContent = message;
    }

    clearInputError(input) {
        input.classList.remove('invalid');
        const fieldName = input.name;
        const errorSpan = document.getElementById(`error-${fieldName}`);
        if (errorSpan) errorSpan.textContent = '';
    }

    showAlert(message, type) {
        this.alertBox.textContent = message;
        this.alertBox.className = `alert alert-${type}`;
        this.alertBox.classList.remove('hidden');
    }

    hideAlert() {
        this.alertBox.classList.add('hidden');
    }

    setLoading(isLoading) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'Procesando...';
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Confirmar Pre-Reserva';
        }
    }

    renderSuccessView(data) {
        this.bookingSection.classList.add('hidden');
        this.confirmationSection.classList.remove('hidden');

        const detailsBox = document.getElementById('confirmation-details');
        detailsBox.innerHTML = `
            <strong>Reserva ID:</strong> ${data.appointment.id}<br>
            <strong>Cliente:</strong> ${data.appointment.userName}<br>
            <strong>Fecha y Hora:</strong> ${data.appointment.date} a las ${data.appointment.time} hs
        `;

        this.startHoldTimer(15 * 60); // 15 minutos en segundos (BR-001)
    }

    startHoldTimer(durationSeconds) {
        let timer = durationSeconds;
        const display = document.getElementById('hold-timer');

        const interval = setInterval(() => {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;

            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (--timer < 0) {
                clearInterval(interval);
                display.textContent = 'EXPIRADO';
            }
        }, 1000);
    }

    resetFormView() {
        this.form.reset();
        this.confirmationSection.classList.add('hidden');
        this.bookingSection.classList.remove('hidden');
    }
}
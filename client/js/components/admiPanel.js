/**
 * Componente UI: Vista de gestión para Staff y Administrador
 */
import { ApiService } from '../services/apiService.js';

export class AdminPanel {
    constructor() {
        this.apiService = new ApiService();
        this.container = document.getElementById('admin-table-body');
        this.refreshBtn = document.getElementById('refresh-admin-btn');

        if (this.container) {
            this.initEvents();
            this.loadAppointments();
        }
    }

    initEvents() {
        this.refreshBtn?.addEventListener('click', () => this.loadAppointments());

        // Event delegation para los botones de cambio de estado
        this.container.addEventListener('click', async (e) => {
            const button = e.target.closest('.action-btn');
            if (!button) return;

            const appointmentId = button.dataset.id;
            const newStatus = button.dataset.status;

            try {
                await this.apiService.updateAppointmentStatus(appointmentId, newStatus);
                this.loadAppointments(); // Recargar tabla
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }

    async loadAppointments() {
        try {
            const appointments = await this.apiService.getAllAppointments();
            this.renderTable(appointments);
        } catch (error) {
            this.container.innerHTML = `<tr><td colspan="5" class="text-error">Error al cargar turnos.</td></tr>`;
        }
    }

    renderTable(appointments) {
        if (appointments.length === 0) {
            this.container.innerHTML = `<tr><td colspan="5" class="text-center">No hay turnos registrados.</td></tr>`;
            return;
        }

        this.container.innerHTML = appointments.map(app => `
            <tr>
                <td><strong>${app.id}</strong></td>
                <td>${app.userName}<br><small class="text-muted">${app.userEmail}</small></td>
                <td>${app.date} - ${app.time} hs</td>
                <td><span class="badge badge-${app.status.toLowerCase()}">${app.status}</span></td>
                <td class="actions-cell">
                    <button class="action-btn btn-success" data-id="${app.id}" data-status="COMPLETADO" title="Marcar Asistió">✓</button>
                    <button class="action-btn btn-warning" data-id="${app.id}" data-status="NO_PRESENTADO" title="Marcar No Asistió (BR-004)">✗</button>
                    <button class="action-btn btn-danger" data-id="${app.id}" data-status="CANCELADO_CLIENTE" title="Cancelar">Cancel</button>
                </td>
            </tr>
        `).join('');
    }
}
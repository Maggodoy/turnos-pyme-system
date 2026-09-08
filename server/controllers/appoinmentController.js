/**
 * Capa de Controlador: Manejo de Peticiones HTTP Simuladas y Respuestas
 */
import { AppointmentService } from '../services/appointmentService.js';

export class AppointmentController {
    constructor() {
        this.appointmentService = new AppointmentService();
    }

    /**
     * POST /api/appointments
     * Recibe los datos del formulario de reserva y delega al servicio
     */
    handleCreateAppointment(req) {
        try {
            // 1. Sanitización / Validación básica de payload
            const { userEmail, userName, date, time } = req.body;

            if (!userEmail || !userName || !date || !time) {
                return {
                    status: 400,
                    data: { message: 'Todos los campos son obligatorios.' }
                };
            }

            // 2. Llamada al servicio de dominio
            const newAppointment = this.appointmentService.createAppointment({
                userEmail,
                userName,
                date,
                time
            });

            // 3. Respuesta de éxito HTTP 201 Created
            return {
                status: 201,
                data: {
                    message: 'Reserva temporal creada con éxito. Confirme mediante su correo dentro de los 15 minutos.',
                    appointment: newAppointment
                }
            };
        } catch (error) {
            // 4. Manejo estandarizado de errores (HTTP status codes)
            return {
                status: error.status || 500,
                data: { message: error.message || 'Error interno del servidor.' }
            };
        }
    }
}
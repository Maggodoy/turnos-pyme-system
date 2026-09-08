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
            const { userEmail, userName, date, time } = req.body;

            if (!userEmail || !userName || !date || !time) {
                return {
                    status: 400,
                    data: { message: 'Todos los campos son obligatorios.' }
                };
            }

            const newAppointment = this.appointmentService.createAppointment({
                userEmail,
                userName,
                date,
                time
            });

            return {
                status: 201,
                data: {
                    message: 'Reserva temporal creada con éxito. Confirme mediante su correo dentro de los 15 minutos.',
                    appointment: newAppointment
                }
            };
        } catch (error) {
            return {
                status: error.status || 500,
                data: { message: error.message || 'Error interno del servidor.' }
            };
        }
    }

    /* ==========================================================================
       ENDPOINTS DE ADMINISTRACIÓN Y STAFF (NUEVO)
       ========================================================================== */

    /**
     * GET /api/admin/appointments
     */
    handleGetAllAppointments() {
        try {
            const appointments = this.appointmentService.getAllAppointments();
            return { status: 200, data: { appointments } };
        } catch (error) {
            return { status: 500, data: { message: 'Error al recuperar la lista de turnos.' } };
        }
    }

    /**
     * PATCH /api/admin/appointments/status
     */
    handleUpdateStatus(req) {
        try {
            const { appointmentId, status } = req.body;
            if (!appointmentId || !status) {
                return { status: 400, data: { message: 'Faltan parámetros requeridos.' } };
            }

            const updatedAppointment = this.appointmentService.updateAppointmentStatus(appointmentId, status);
            return {
                status: 200,
                data: { message: 'Estado del turno actualizado correctamente.', appointment: updatedAppointment }
            };
        } catch (error) {
            return {
                status: error.status || 500,
                data: { message: error.message || 'Error al actualizar el estado.' }
            };
        }
    }
}
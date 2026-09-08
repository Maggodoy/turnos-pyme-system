/**
 * Capa de Servicios del Cliente: Simulación de llamadas Fetch/Axios a la API REST
 */
import { AppointmentController } from '../../../server/controllers/appointmentController.js';

export class ApiService {
    constructor() {
        this.appointmentController = new AppointmentController();
    }

    /**
     * Envía una solicitud POST para crear una reserva
     */
    async createBooking(bookingPayload) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const req = { body: bookingPayload };
        const response = this.appointmentController.handleCreateAppointment(req);

        if (response.status >= 400) {
            throw new Error(response.data.message);
        }

        return response.data;
    }

    /* ==========================================================================
       MÉTODOS DE ADMINISTRACIÓN Y STAFF (NUEVO)
       ========================================================================== */

    async getAllAppointments() {
        await new Promise(resolve => setTimeout(resolve, 200));
        const response = this.appointmentController.handleGetAllAppointments();
        if (response.status >= 400) throw new Error(response.data.message);
        return response.data.appointments;
    }

    async updateAppointmentStatus(appointmentId, status) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const req = { body: { appointmentId, status } };
        const response = this.appointmentController.handleUpdateStatus(req);
        if (response.status >= 400) throw new Error(response.data.message);
        return response.data;
    }
}
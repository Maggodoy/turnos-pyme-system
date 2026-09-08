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
     * @param {Object} bookingPayload 
     * @returns {Promise<Object>} Respuesta estructurada de la API
     */
    async createBooking(bookingPayload) {
        // Simulamos la latencia de red de una petición HTTP real (300ms)
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulamos la llamada al endpoint POST /api/appointments
        const req = { body: bookingPayload };
        const response = this.appointmentController.handleCreateAppointment(req);

        // Si la API responde con error (4xx o 5xx), lanzamos la excepción para el UI
        if (response.status >= 400) {
            throw new Error(response.data.message);
        }

        return response.data;
    }
}
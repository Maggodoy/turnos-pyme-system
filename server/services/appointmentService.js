/**
 * Capa de Servicios: Ejecución de Reglas de Negocio
 */

import { BUSINESS_RULES, APPOINTMENT_STATUS } from '../config/businessRules.js';
import { DbAdapter } from '../database/dbAdapter.js';

export class AppointmentService {
    constructor() {
        this.db = new DbAdapter();
    }

    // Validar BR-005: Límite de turnos activos por cliente
    validateActiveBookingsLimit(userEmail) {
        const appointments = this.db.getAll();
        const activeBookings = appointments.filter(app => 
            app.userEmail === userEmail && 
            (app.status === APPOINTMENT_STATUS.PENDING || app.status === APPOINTMENT_STATUS.CONFIRMED)
        );

        if (activeBookings.length >= BUSINESS_RULES.MAX_ACTIVE_BOOKINGS) {
            throw { status: 400, message: `Ha alcanzado el límite máximo de ${BUSINESS_RULES.MAX_ACTIVE_BOOKINGS} reservas activas simultáneas.` };
        }
    }

    // Validar BR-002: Control de Concurrencia
    validateSlotAvailability(date, time) {
        const appointments = this.db.getAll();
        const isOccupied = appointments.some(app => 
            app.date === date && 
            app.time === time && 
            (app.status === APPOINTMENT_STATUS.PENDING || app.status === APPOINTMENT_STATUS.CONFIRMED)
        );

        if (isOccupied) {
            throw { status: 409, message: 'El horario seleccionado acaba de ser reservado. Por favor, elija otro.' };
        }
    }

    // Proceso de Reserva (US-001)
    createAppointment(bookingData) {
        this.validateActiveBookingsLimit(bookingData.userEmail);
        this.validateSlotAvailability(bookingData.date, bookingData.time);

        const now = new Date();
        const expiresAt = new Date(now.getTime() + BUSINESS_RULES.HOLD_TIME_MINUTES * 60000);

        const newAppointment = {
            id: 'TRN-' + Math.floor(100000 + Math.random() * 900000),
            userEmail: bookingData.userEmail,
            userName: bookingData.userName,
            date: bookingData.date,
            time: bookingData.time,
            status: APPOINTMENT_STATUS.PENDING,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString()
        };

        return this.db.insert(newAppointment);
    }

    /* ==========================================================================
       MÓDULO DE ADMINISTRACIÓN / STAFF (NUEVO)
       ========================================================================== */

    // Obtener la lista completa de turnos para el panel del staff
    getAllAppointments() {
        return this.db.getAll();
    }

    // Cambiar estado de un turno (COMPLETADO / NO_SHOW / CANCELADO)
    updateAppointmentStatus(appointmentId, newStatus) {
        const appointments = this.db.getAll();
        const appointment = appointments.find(app => app.id === appointmentId);

        if (!appointment) {
            throw { status: 404, message: 'El turno solicitado no existe.' };
        }

        const updated = this.db.update(appointmentId, { status: newStatus });

        // BR-004: Si se marca NO_SHOW, verificar reincidencias del cliente
        if (newStatus === APPOINTMENT_STATUS.NO_SHOW) {
            this.checkAndApplyNoShowPenalties(updated.userEmail);
        }

        return updated;
    }

    // BR-004: Control de ausencias consecutivas
    checkAndApplyNoShowPenalties(userEmail) {
        const appointments = this.db.getAll();
        const noShowCount = appointments.filter(app => 
            app.userEmail === userEmail && app.status === APPOINTMENT_STATUS.NO_SHOW
        ).length;

        if (noShowCount >= BUSINESS_RULES.MAX_NO_SHOWS_ALLOWED) {
            console.warn(`[BR-004 ALERTA]: El usuario ${userEmail} ha superado el límite de ausencias (${noShowCount}).`);
        }
    }
}

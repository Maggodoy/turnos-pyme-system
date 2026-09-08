/**
 * Centralización de constantes y parámetros operativos (BR-001 a BR-005)
 */
export const BUSINESS_RULES = {
    HOLD_TIME_MINUTES: 15,          // BR-001: Tiempo de bloqueo temporal
    CANCELATION_WINDOW_HOURS: 24,   // BR-003: Tiempo límite previo para cancelar
    MAX_NO_SHOWS_ALLOWED: 3,        // BR-004: Ausencias permitidas antes de penalización
    MAX_ACTIVE_BOOKINGS: 2,         // BR-005: Límite de reservas simultáneas
    RATE_LIMIT_PER_HOUR: 3          // BR-004: Anti-spam
};

export const APPOINTMENT_STATUS = {
    PENDING: 'PENDIENTE',
    CONFIRMED: 'CONFIRMADO',
    EXPIRED: 'EXPIRADO',
    CANCELLED_BY_CLIENT: 'CANCELADO_CLIENTE',
    COMPLETED: 'COMPLETADO',
    NO_SHOW: 'NO_PRESENTADO'
};
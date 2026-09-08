/**

 * Punto de Entrada Principal (Application Entry Point / Bootstrapper)
 */
import { BookingForm } from './components/bookingForm.js';

// Esperamos a que la estructura DOM esté lista
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializamos el componente principal del formulario
        new BookingForm();
        console.log('🚀 [App Initialized]: Sistema de Gestión de Turnos listo.');
    } catch (error) {
        console.error('❌ [App Error]: Fallo al inicializar la aplicación:', error);
    }
});
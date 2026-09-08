/**

 * Punto de Entrada Principal (Application Entry Point / Bootstrapper)
 */
import { BookingForm } from './components/bookingForm.js';
import { AdminPanel } from './components/adminPanel.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        new BookingForm();
        new AdminPanel(); // Inicializa la tabla del staff
        console.log('🚀 [App Initialized]: Módulos Cliente y Admin cargados.');
    } catch (error) {
        console.error('❌ [App Error]:', error);
    }
});

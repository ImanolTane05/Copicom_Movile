import { API_BASE_URL } from '../utils/constants'; 

/**
 * Función para cargar notificaciones desde el servidor.
 */
export const fetchNotifications = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/notificaciones`);
        
        if (!response.ok) {
             // ✅ CORREGIDO: El error de tipeo `API_BASE_BASE_URL` ha sido solucionado.
             throw new Error(`Error HTTP! status: ${response.status}. URL: ${API_BASE_URL}/notificaciones`);
        }
        
        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("Error al cargar notificaciones desde la API:", error);
        return [];
    }
};
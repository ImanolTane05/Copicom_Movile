import { API_BASE_URL } from '../utils/constants';

/**
 * 🔵 Obtiene notificaciones desde el servidor
 */
export const fetchNotifications = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/notificaciones`);

        if (!response.ok) {
            throw new Error(
                `Error HTTP ${response.status} al cargar ${API_BASE_URL}/notificaciones`
            );
        }

        return await response.json();

    } catch (error) {
        console.error("❌ Error al cargar notificaciones:", error);
        return [];
    }
};


/**
 * 🟡 Marca como leída una notificación
 */
export const marcarNotificacionLeida = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notificaciones/${id}/leida`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        });

        return await response.json();

    } catch (error) {
        console.error("❌ Error al marcar como leída:", error);
        return null;
    }
};


/**
 * 🔴 Elimina una notificación del servidor
 */
export const eliminarNotificacion = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notificaciones/${id}`, {
            method: "DELETE",
        });

        return await response.json();

    } catch (error) {
        console.error("❌ Error al eliminar notificación:", error);
        return null;
    }
};

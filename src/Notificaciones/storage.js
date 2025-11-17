import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_STORAGE_KEY = '@CopiComTlax_Notifications';

/**
 * Carga la lista de notificaciones guardadas localmente.
 * @returns {Promise<Array>} Lista de notificaciones o un array vacío.
 */
export const loadLocalNotifications = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        // Si hay datos, los parsea. Si no, devuelve un array vacío.
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Error al cargar notificaciones de AsyncStorage:", e);
        return [];
    }
};

/**
 * Guarda la lista actual de notificaciones localmente.
 * @param {Array} notifications - La lista completa de notificaciones a guardar.
 */
export const saveLocalNotifications = async (notifications) => {
    try {
        const jsonValue = JSON.stringify(notifications);
        await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error("Error al guardar notificaciones en AsyncStorage:", e);
    }
};
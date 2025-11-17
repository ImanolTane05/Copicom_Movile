import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
// Asegúrate de que este path a constants sea correcto
import { API_BASE_URL } from './constants'; 

// Configuración de notificaciones para que se muestren cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Muestra una alerta (banner)
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Solicita permisos de notificación y obtiene el token push de Expo.
 */
async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    // Es buena práctica definir un canal en Android para mejor control
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // 1. Verificar/Solicitar Permisos
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Fallo al obtener el token push! Permisos no concedidos.');
    return;
  }
  
  // 2. Obtener el Token
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token obtenido:', token);

  return token;
}

/**
 * Envía el token al backend para ser registrado.
 * @param {string} token - El Expo Push Token a registrar.
 */
async function sendTokenToBackend(token) {
    if (!token) return;

    try {
        // Importante: La URL debe apuntar a tu IP local y puerto del backend.
        // Asegúrate de que API_BASE_URL no termine en '/api' si lo añades aquí.
        // Asumiendo que tu API_BASE_URL es algo como: http://192.168.1.X:5000/api
        await fetch(`${API_BASE_URL}/tokens/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        console.log('Token enviado al backend exitosamente.');
    } catch (error) {
        console.error('Error al enviar el token al backend:', error);
    }
}


/**
 * Función principal que registra el token y lo envía al backend.
 * También configura el listener para el manejo de la eliminación de contenido.
 */
export async function setupNotifications() {
    const token = await registerForPushNotificationsAsync();
    if (token) {
        sendTokenToBackend(token);
    }
    
    // Listener para cuando una notificación llega (App abierta, en segundo o primer plano)
    Notifications.addNotificationReceivedListener(notification => {
        const { type, id, action } = notification.request.content.data;
        
        // Esta lógica es para eliminar visualmente el contenido del listado
        // o forzar una actualización en segundo plano.
        if (action === 'deleted') {
            console.log(`[PUSH SILENCIOSA] Contenido (${type}) con ID ${id} fue eliminado.`);
            
            // IDEA: Aquí puedes usar Redux o Context para forzar la eliminación del 
            // elemento de las listas de Noticias/Encuestas sin hacer un refresh completo.
            // Para empezar, una simple recarga de las listas al volver a la pantalla 
            // será suficiente hasta que implementes un estado más complejo.
        }
    });

    // Listener para cuando el usuario interactúa con la notificación
    Notifications.addNotificationResponseReceivedListener(response => {
        const { data } = response.notification.request.content;
        console.log('Notificación tocada:', data);
        
        // Lógica de Navegación:
        // Aquí debes usar tu objeto de navegación para llevar al usuario a 
        // NewsDetailScreen o PollDetailScreen, usando data.id.
    });
}
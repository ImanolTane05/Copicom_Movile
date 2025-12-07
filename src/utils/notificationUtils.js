// notificationUtils.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_BASE_URL } from './constants';
import { navigate, navigationRef } from '../Navigation/navigationRef'; 


export async function setupNotifications() {
 
  Notifications.addNotificationResponseReceivedListener(response => {
    const data = response?.notification?.request?.content?.data;

    console.log('📲 Notificación tocada:', data);

    if (!data) return;

  
    if (data?.tipo === 'encuesta' && data?.encuestaId) {
      console.log('➡️ Navegando a encuesta:', data.encuestaId);

      
      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0, 
          routes: [
            { 
              name: 'Encuestas', 
              params: {
                screen: 'PollDetail', 
                params: {
                  encuestaId: data.encuestaId,
                  titulo: data.titulo || 'Encuesta',
                },
              }
            },
          ],
        });
      }
      return;
    }

    
    if (data?.tipo === 'noticia' && data?.noticiaId) {
      console.log('➡️ Navegando a noticia:', data.noticiaId);

      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [
            { 
              name: 'Noticias', 
              params: {
                screen: 'NewsDetail', 
                params: {
                  noticiaId: data.noticiaId,
                },
              }
            },
          ],
        });
      }
      return;
    }
  });
}
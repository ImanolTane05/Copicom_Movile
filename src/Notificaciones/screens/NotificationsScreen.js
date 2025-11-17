import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ActivityIndicator, 
    StyleSheet, 
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view'; 
import { useNavigation } from '@react-navigation/native'; 
import * as Notifications from 'expo-notifications'; 

import { fetchNotifications } from '../api'; 
import { loadLocalNotifications, saveLocalNotifications } from '../storage'; 

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Funciones de Utilidad ---

// Función para formatear la fecha a un formato legible ('Hace X min/h')
const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Desconocido';
    try {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMinutes = Math.floor((now - past) / (1000 * 60));

        if (diffInMinutes < 1) return 'Ahora';
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
        return past.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    } catch (e) {
        return 'Fecha Inválida'; 
    }
};

// --- Componente de Ítems Ocultos (Acciones al Deslizar) ---

const HiddenItemWithActions = ({ onDelete, onMarkAsRead }) => (
    <View style={styles.rowBack}>
        <View style={styles.rightActionsContainer}>
            <TouchableOpacity 
                style={[styles.actionButton, styles.readBtn]} 
                onPress={onMarkAsRead}
                activeOpacity={0.7}
            >
                <Ionicons name="mail-open-outline" size={24} color="white" />
                <Text style={styles.actionText}>Leída</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.actionButton, styles.deleteBtn]} 
                onPress={onDelete}
                activeOpacity={0.7}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// --- Componente de Ítem de Notificación ---
const NotificationItem = ({ item, onPress }) => (
    <TouchableOpacity 
        style={[styles.notificationCard, item.leida ? styles.cardLeida : styles.cardNoLeida]}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
    >
        <View style={styles.rowContent}>
            {/* Icono de tipo */}
            <Ionicons 
                name={item.tipo === 'Encuesta' ? "document-text-outline" : item.tipo === 'Noticia' ? "newspaper-outline" : "alert-circle-outline"}
                size={24} 
                color={!item.leida ? '#013D6B' : '#ccc'} 
                style={styles.iconType}
            />

            <View style={styles.content}>
                <Text style={[styles.title, !item.leida && styles.titleUnread]} numberOfLines={1}>
                    {/* Punto no leído (Solo si no está leída) */}
                    {!item.leida && <Text style={styles.dotText}>● </Text>}
                    {String(item.titulo || 'Sin Título')} 
                </Text>
                
                <Text style={styles.description} numberOfLines={2}>
                    {String(item.descripcion || 'Sin descripción.')}
                </Text>
            </View>

            <View style={styles.chipContainer}>
                <View style={[styles.dateChip, !item.leida ? styles.chipUnread : styles.chipRead]}>
                    <Text style={[styles.dateText, !item.leida && styles.dateTextUnread]}>
                        {formatTimeAgo(item.fecha)} 
                    </Text>
                </View>
                <Ionicons 
                    name="chevron-forward-outline" 
                    size={20} 
                    color={!item.leida ? '#013D6B' : '#ccc'} 
                    style={styles.chevron}
                />
            </View>
        </View>
    </TouchableOpacity>
);

// --- Componente de Barra de Navegación Inferior (simulada) ---
const CustomTabBar = ({ selectedTab }) => {
    const getIconName = (tab) => {
        if (tab === 'Noticias') return 'newspaper-outline';
        if (tab === 'Encuestas') return 'document-text-outline';
        if (tab === 'Alertas') return 'notifications-outline';
        return '';
    };

    const getIconColor = (tab) => selectedTab === tab ? '#013D6B' : '#999';
    const getTextColor = (tab) => selectedTab === tab ? styles.tabTextActive : styles.tabText;

    return (
        <View style={styles.tabBar}>
            {['Noticias', 'Encuestas', 'Alertas'].map(tab => (
                <TouchableOpacity key={tab} style={styles.tabItem}>
                    <Ionicons name={getIconName(tab)} size={24} color={getIconColor(tab)} />
                    <Text style={[styles.tabText, getTextColor(tab)]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};


// --- Componente Principal ---

const NotificationsScreen = () => {
    const navigation = useNavigation();
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    // Valor para cuántos píxeles se desliza para ver los botones
    const slideOutValue = -160; 

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    // Normaliza los datos, asegura ID como cadena y maneja _id
    const normalizeApiData = (data) => {
        return data.map(item => ({
            id: String(item._id || item.id || Date.now()), 
            titulo: item.titulo,
            descripcion: item.descripcion,
            fecha: item.fecha, 
            leida: item.leida || false,
            tipo: item.tipo, // 'Noticia', 'Encuesta', 'Alerta', etc.
        }));
    };

    // Actualiza el estado y la persistencia local
    const updateNotifications = (newNotifications) => {
        setNotificaciones(newNotifications);
        saveLocalNotifications(newNotifications);
    };

    const handleMarkAsRead = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey); 
        const updatedList = notificaciones.map(n => 
            n.id === rowKey ? { ...n, leida: true } : n
        );
        updateNotifications(updatedList);
    };

    const handleDelete = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey); 
        setTimeout(() => {
            const updatedList = notificaciones.filter(n => n.id !== rowKey);
            updateNotifications(updatedList);
        }, 300); 
    };

    // Lógica de Navegación
    const handlePress = (item) => {
        // 1. Marcar como leída
        const updatedList = notificaciones.map(n => 
            n.id === item.id ? { ...n, leida: true } : n
        );
        updateNotifications(updatedList);
        
        // 2. Navegación condicional
        if (item.tipo === 'Noticia') {
            // Reemplaza 'NewsDetailScreen' con el nombre de tu pantalla de detalle de noticias
            navigation.navigate('NewsDetailScreen', { itemId: item.id }); 
        } else if (item.tipo === 'Encuesta') {
            // Reemplaza 'PollDetailScreen' con el nombre de tu pantalla de detalle de encuestas
            navigation.navigate('PollDetailScreen', { itemId: item.id }); 
        } else {
            // Para Alertas (o tipos desconocidos), solo marca como leído y registra en consola
            console.log(`Mensaje de tipo ${item.tipo} leída. No se requiere navegación.`);
        }
    };
    
    // --- LÓGICA DE CARGA: LOCAL + REMOTO ---
    useEffect(() => {
        const loadData = async () => {
            const localData = await loadLocalNotifications();
            if (localData.length > 0) {
                setNotificaciones(localData);
                setLoading(false); 
            }

            try {
                if (localData.length === 0) setLoading(true); 

                const apiData = await fetchNotifications(); 
                const normalizedApiData = normalizeApiData(apiData);
                
                const newApiIds = new Set(normalizedApiData.map(item => item.id));
                const localOnly = localData.filter(item => !newApiIds.has(item.id));
                
                const finalNotifications = [...normalizedApiData, ...localOnly]
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

                updateNotifications(finalNotifications); 

            } catch (error) {
                console.error("Error al sincronizar notificaciones:", error);
                if (localData.length === 0) setNotificaciones([]); 
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    

    // --- LÓGICA PARA RECIBIR NOTIFICACIONES PUSH EN TIEMPO REAL ---
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('🔔 Notificación Push Recibida en Foreground');
            
            const { data, title, body } = notification.request.content;
            const notificationId = String(Date.now()); 

            const newNotification = {
                id: notificationId, 
                titulo: title || data.titulo || 'Nueva Alerta',
                descripcion: body || data.descripcion || 'Contenido de la notificación.',
                fecha: new Date().toISOString(), 
                leida: false,
                tipo: data.tipo || 'Alerta',
            };
            
            setNotificaciones(prev => {
                const updatedList = [newNotification, ...prev];
                saveLocalNotifications(updatedList); 
                return updatedList;
            });
        });

        // CORRECCIÓN: Se usa .remove() para limpiar la suscripción y evitar el TypeError
        return () => subscription.remove();
    }, []); 


    const renderItem = ({ item }) => (
        <View style={styles.rowContainer}>
            <NotificationItem item={item} onPress={handlePress} />
        </View>
    );

    const renderHiddenItem = ({ item, rowMap }) => (
        <View style={styles.rowContainer}>
            <HiddenItemWithActions 
                onDelete={() => handleDelete(rowMap, item.id)}
                onMarkAsRead={() => handleMarkAsRead(rowMap, item.id)}
            />
        </View>
    );

    if (loading && notificaciones.length === 0) { 
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#013D6B" />
                <Text style={styles.loadingText}>Cargando mensajes...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.fullScreen}> 
            <View style={styles.headerContainer}>
                <Text style={styles.mainTitle}>Mensajes</Text>
            </View>
            
            <SwipeListView
                data={notificaciones}
                keyExtractor={item => String(item.id)} 
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={slideOutValue} 
                disableRightSwipe={true} 
                stopRightSwipe={slideOutValue} 
                contentContainerStyle={styles.listContent}
                
                ListEmptyComponent={
                    <View style={styles.centeredList}>
                        <Ionicons name="notifications-off-outline" size={50} color="#ccc" style={{ marginBottom: 10 }} />
                        <Text style={styles.emptyText}>No hay mensajes aún.</Text>
                    </View>
                }
            />

            <CustomTabBar selectedTab="Alertas" />
        </SafeAreaView>
    );
};

// --- Estilos Mejorados ---

const styles = StyleSheet.create({
    fullScreen: { flex: 1, backgroundColor: '#f0f2f5' }, 
    headerContainer: {
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    mainTitle: {
        fontSize: 30, 
        fontWeight: 'bold',
        color: '#333',
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
    centeredList: { marginTop: 50, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
    listContent: { 
        paddingTop: 10, 
        paddingHorizontal: 15,
        paddingBottom: 80, 
    },

    // --- Estilos de la Tarjeta de Notificación ---
    rowContainer: {
        marginBottom: 8, 
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'transparent', 
    },
    notificationCard: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 15,
        zIndex: 10, 
    },
    cardLeida: {
        opacity: 0.95, 
        backgroundColor: '#fafafa', 
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconType: {
        marginRight: 10,
    },
    content: { 
        flex: 1, 
        marginRight: 10 
    },
    
    // --- Estilos de Texto ---
    dotText: {
        color: '#013D6B', 
        fontSize: 10, 
        lineHeight: 18,
    },
    title: { 
        fontSize: 16, 
        color: '#333',
        marginBottom: 2,
        fontWeight: '500', 
    },
    titleUnread: {
        fontWeight: '700', 
        color: '#013D6B', 
    },
    description: { 
        fontSize: 13, 
        color: '#666', 
    },

    // --- Estilos de la Derecha (Fecha y Flecha) ---
    chipContainer: {
        alignItems: 'flex-end',
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    dateChip: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 15, 
        marginBottom: 5,
        alignSelf: 'flex-end',
    },
    chipRead: {
        backgroundColor: 'transparent', 
    },
    chipUnread: {
        backgroundColor: '#013D6B', 
    },
    dateText: { 
        fontSize: 12, 
        color: '#999',
        fontWeight: '500',
    },
    dateTextUnread: {
        color: 'white',
    },
    chevron: {
        alignSelf: 'flex-end',
        marginTop: 5,
    },


    // --- Estilos de Botones de Acción (Al Deslizar) ---
    rowBack: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 15,
        backgroundColor: 'transparent', 
    },
    rightActionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 150, 
        height: '90%', 
    },
    actionButton: {
        width: 70,
        height: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
        padding: 5,
    },
    actionText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
    readBtn: {
        backgroundColor: '#007aff', 
    },
    deleteBtn: {
        backgroundColor: '#ff3b30', 
    },
    
    // --- Estilos de la Barra de Navegación Inferior (simulada) ---
    tabBar: {
        flexDirection: 'row',
        height: 60, 
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: 'white',
        position: 'absolute', 
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tabText: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    tabTextActive: {
        color: '#013D6B', 
        fontWeight: 'bold',
    },
    emptyText: { 
        fontSize: 18, 
        color: '#777' 
    }
});

export default NotificationsScreen;
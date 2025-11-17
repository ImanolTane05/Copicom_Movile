import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet, 
    TouchableOpacity,
    Dimensions,
    SafeAreaView // Para el Tab Bar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

const MOCK_NOTIFICACIONES = [
    { id: '1', titulo: 'Nueva Encuesta Disponible', descripcion: 'Responde la encuesta de Satisfacción Laboral.', fecha: 'Hace 5 min', leida: false, tipo: 'Encuesta' },
    { id: '2', titulo: 'Alerta de Servidor', descripcion: 'Mantenimiento programado para esta noche.', fecha: 'Hace 3 horas', leida: false, tipo: 'Noticia' },
    { id: '3', titulo: 'Mensaje de Bienvenida', descripcion: 'Gracias por usar nuestra app.', fecha: 'Ayer', leida: true, tipo: 'Noticia' },
    { id: '4', titulo: 'Noticia Importante', descripcion: 'Nuevos protocolos de seguridad implementados.', fecha: 'Ayer', leida: true, tipo: 'Noticia' },
    { id: '5', titulo: 'Actualización de App', descripcion: 'Nueva versión disponible con mejor rendimiento.', fecha: '04/03/25', leida: true, tipo: 'Noticia' }, 
];

// --- Componente para las acciones de deslizar (Fila Oculta) ---
const HiddenItemWithActions = ({ onDelete, onMarkAsRead }) => (
    <View style={styles.rowBack}>
        {/* Botón Circular 1: Eliminar */}
        <TouchableOpacity 
            style={[styles.circularBtn, styles.deleteBtn]} 
            onPress={onDelete}
        >
            <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
        {/* Botón Circular 2: Leída */}
        <TouchableOpacity 
            style={[styles.circularBtn, styles.readBtn]} 
            onPress={onMarkAsRead}
        >
            <Ionicons name="mail-open-outline" size={20} color="white" />
        </TouchableOpacity>
    </View>
);

// --- Componente de la Fila de Notificación (Tarjeta con Chip) ---
const NotificationItem = ({ item, onPress }) => (
    <TouchableOpacity 
        style={[styles.notificationCard, item.leida ? styles.cardLeida : styles.cardNoLeida]}
        onPress={() => onPress(item)}
    >
        <View style={styles.rowContent}>
            {/* Contenido Principal (Título y Descripción) */}
            <View style={styles.content}>
                {/* Punto azul y Negrita para No Leído */}
                <Text style={[styles.title, !item.leida && styles.titleUnread]}>
                    {!item.leida && <Text style={styles.dotText}>● </Text>}
                    {item.titulo}
                </Text>
                
                <Text style={styles.description} numberOfLines={2}>
                    {item.descripcion}
                </Text>
            </View>

            {/* Chip de Fecha/Acción (Nuevo Estilo) */}
            <View style={styles.chipContainer}>
                {/* El color del chip puede ser dinámico si quieres, aquí es estático para replicar la imagen */}
                <View style={[styles.dateChip, !item.leida ? styles.chipUnread : styles.chipRead]}>
                    <Text style={[styles.dateText, !item.leida && styles.dateTextUnread]}>
                        {item.fecha}
                    </Text>
                    <Ionicons 
                        name="chevron-forward-outline" 
                        size={15} 
                        color={!item.leida ? 'white' : '#999'} 
                    />
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const CustomTabBar = ({ selectedTab }) => (
    <View style={styles.tabBar}>
        {/* Icono 1: Noticias */}
        <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="newspaper-outline" size={24} color={selectedTab === 'Noticias' ? '#013D6B' : '#999'} />
            <Text style={[styles.tabText, selectedTab === 'Noticias' && styles.tabTextActive]}>Noticias</Text>
        </TouchableOpacity>
        {/* Icono 2: Encuestas */}
        <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="document-text-outline" size={24} color={selectedTab === 'Encuestas' ? '#013D6B' : '#999'} />
            <Text style={[styles.tabText, selectedTab === 'Encuestas' && styles.tabTextActive]}>Encuestas</Text>
        </TouchableOpacity>
        {/* Icono 3: Alertas (Seleccionado) */}
        <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="notifications-outline" size={24} color={'#013D6B'} />
            <Text style={[styles.tabText, styles.tabTextActive]}>Alertas</Text>
        </TouchableOpacity>
    </View>
);


const NotificationsScreen = () => {
    const navigation = useNavigation();
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleMarkAsRead = (id) => {
        setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    };

    const handleDelete = (id) => {
        setNotificaciones(prev => prev.filter(n => n.id !== id));
    };

    const handlePress = (item) => {
        handleMarkAsRead(item.id); 
        console.log(`Navegando a ${item.tipo}: ${item.titulo}`);
        // Implementa la navegación real aquí
    };

    useEffect(() => {
        const loadNotificaciones = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800)); 
                setNotificaciones(MOCK_NOTIFICACIONES); 
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
                setNotificaciones([]);
            } finally {
                setLoading(false);
            }
        };
        loadNotificaciones();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.swipeableContainer}>
            {/* Fila Oculta (Botones Circulares) */}
            <HiddenItemWithActions 
                onDelete={() => handleDelete(item.id)}
                onMarkAsRead={() => handleMarkAsRead(item.id)}
            />
            {/* Fila Visible (Tarjeta con Chip) */}
            <NotificationItem item={item} onPress={handlePress} />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#013D6B" />
                <Text style={styles.loadingText}>Cargando notificaciones...</Text>
            </View>
        );
    }

    // Usamos SafeAreaView para asegurar que el contenido y la barra se vean bien
    return (
        <SafeAreaView style={styles.fullScreen}>
            <View style={styles.headerContainer}>
                <Text style={styles.mainTitle}>Mensajes</Text>
            </View>
            
            <FlatList
                data={notificaciones}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centeredList}>
                        <Ionicons name="notifications-off-outline" size={50} color="#ccc" style={{ marginBottom: 10 }} />
                        <Text style={styles.emptyText}>No tienes notificaciones recientes.</Text>
                    </View>
                }
            />

            <CustomTabBar selectedTab="Alertas" />
        </SafeAreaView>
    );
};

// --- Estilos Finales ---
const styles = StyleSheet.create({
    fullScreen: { flex: 1, backgroundColor: '#f8f9fa' }, // Contenedor principal
    headerContainer: {
        paddingHorizontal: 15,
        paddingTop: 0, // El padding superior lo maneja SafeAreaView
        paddingBottom: 15,
        backgroundColor: 'white',
    },
    mainTitle: {
        fontSize: 34, 
        fontWeight: 'bold',
        color: 'black',
    },
    centered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    centeredList: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    listContent: { 
        paddingTop: 10, 
        paddingBottom: 20 
    },

    // --- Estilos de la Tarjeta Deslizable ---
    swipeableContainer: {
        marginHorizontal: 15, 
        marginBottom: 10,
        borderRadius: 12, 
        overflow: 'hidden', 
    },
    notificationCard: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 15,
        elevation: 3, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        zIndex: 10, 
    },
    cardLeida: {
        opacity: 0.9, // Las leídas son solo un poco más tenues
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: { 
        flex: 1, 
        marginRight: 10 // Menos margen para dejar espacio al chip
    },
    
    // --- Estilos del estado No Leído (Punto y Negrita) ---
    dotText: {
        color: '#013D6B', // Punto azul de la marca
        fontSize: 12,
    },
    title: { 
        fontSize: 17, 
        color: 'black',
        marginBottom: 2,
    },
    titleUnread: {
        fontWeight: '900', // Negrita más fuerte
    },
    description: { 
        fontSize: 15, 
        color: '#555', // Gris más oscuro para mejor lectura
    },

    // --- Estilos del Chip de Fecha/Acción (NUEVO) ---
    chipContainer: {
        alignSelf: 'flex-start', // Asegura que el chip se alinee con el título
        paddingTop: 2, // Ajuste visual
    },
    dateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20, // Forma de pastilla/chip
    },
    chipRead: {
        backgroundColor: '#eee', // Gris claro para las leídas
    },
    chipUnread: {
        backgroundColor: '#013D6B', // Color de marca para las no leídas
    },
    dateText: { 
        fontSize: 14, 
        marginRight: 5,
    },
    dateTextUnread: {
        color: 'white',
        fontWeight: 'bold',
    },

    // --- Estilos de Botones Circulares (Al Deslizar) ---
    rowBack: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 20,
    },
    circularBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5, 
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    readBtn: {
        backgroundColor: '#013D6B', 
    },
    deleteBtn: {
        backgroundColor: '#ff3b30', 
    },
    
    // --- Estilos de la Barra de Navegación Inferior (NUEVO) ---
    tabBar: {
        flexDirection: 'row',
        height: 70, // Altura adecuada para dispositivos modernos
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 10,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tabText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    tabTextActive: {
        color: '#013D6B', // Color de marca para la pestaña activa
        fontWeight: 'bold',
    },
    emptyText: { 
        fontSize: 18, 
        color: '#555' 
    }
});

export default NotificationsScreen;
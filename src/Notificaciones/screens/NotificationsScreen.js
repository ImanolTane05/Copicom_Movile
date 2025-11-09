import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_NOTIFICACIONES = [
    { id: '1', titulo: 'Nueva Encuesta Disponible', descripcion: 'Responde la encuesta de Satisfacción Laboral.', fecha: 'Hace 5 min', leida: false },
    { id: '2', titulo: 'Alerta de Servidor', descripcion: 'Mantenimiento programado para esta noche.', fecha: 'Hace 3 horas', leida: false },
    { id: '3', titulo: 'Mensaje de Bienvenida', descripcion: 'Gracias por usar nuestra app.', fecha: 'Ayer', leida: true },
    { id: '4', titulo: 'Noticia Importante', descripcion: 'Nuevos protocolos de seguridad implementados.', fecha: 'Ayer', leida: true },
    { id: '5', titulo: 'Actualización de App', descripcion: 'Nueva versión disponible con mejor rendimiento.', fecha: 'Hace 2 días', leida: true },
];

const NotificationsScreen = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <TouchableOpacity 
            style={[styles.notificationItem, item.leida ? styles.leida : styles.noLeida]}
           
            onPress={() => console.log('Notificación presionada:', item.id)}
        >
            <Ionicons 
                name={item.leida ? 'mail-open-outline' : 'mail-outline'} 
                size={20} 
                color={item.leida ? '#999' : '#013D6B'} 
                style={styles.icon}
            />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{item.titulo}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.descripcion}</Text>
                <Text style={styles.date}>{item.fecha}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#013D6B" />
                <Text>Cargando notificaciones...</Text>
            </View>
        );
    }

    if (notificaciones.length === 0) {
        return (
            <View style={styles.centered}>
                <Ionicons name="notifications-off-outline" size={50} color="#ccc" style={{ marginBottom: 10 }} />
                <Text style={styles.emptyText}>No tienes notificaciones recientes.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={notificaciones}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingVertical: 10, paddingBottom: 80 },
    notificationItem: {
        flexDirection: 'row',
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: 'white',
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    icon: { marginRight: 10, alignSelf: 'flex-start', marginTop: 2 },
    content: { flex: 1 },
    noLeida: {
        borderLeftColor: '#013D6B', 
        borderLeftWidth: 3,
    },
    leida: {
        borderLeftColor: '#ccc',
        opacity: 0.8,
    },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    description: { fontSize: 14, color: '#555', marginTop: 4 },
    date: { fontSize: 12, color: '#999', marginTop: 8, textAlign: 'right' },
    emptyText: { fontSize: 16, color: '#555' }
});

export default NotificationsScreen;

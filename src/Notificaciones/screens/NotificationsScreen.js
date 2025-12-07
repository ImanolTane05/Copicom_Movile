import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';

import { fetchNotifications } from '../api';
import { loadLocalNotifications, saveLocalNotifications } from '../storage';
import { getInstallTime } from '../installTime';


const formatTimeAgo = (dateString) => {
    try {
        const now = new Date();
        const past = new Date(dateString);
        const diff = now - past;

        const min = Math.floor(diff / 60000);
        if (min < 1) return "Ahora";
        if (min < 60) return `Hace ${min} min`;

        const hrs = Math.floor(min / 60);
        if (hrs < 24) return `Hace ${hrs} h`;

        return past.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short"
        });
    } catch {
        return "Fecha inválida";
    }
};


const normalizeApiData = (data) => {
    return data.map(n => ({
        id: String(n._id || Date.now()),
        titulo: n.titulo || "Sin título",
        descripcion: n.descripcion || n.mensaje || "Sin mensaje",
        fecha: n.fecha || new Date().toISOString(),
        tipo: (n.tipo || "Alerta").toLowerCase(),
        leida: n.leida || false,

      
        noticiaId: n.noticiaId || n.linkId || null,
        encuestaId: n.encuestaId || n.linkId || null,
    }));
};

const NotificationsScreen = () => {
    const navigation = useNavigation();

    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateNotifications = (list) => {
        setNotificaciones(list);
        saveLocalNotifications(list);
    };

    /** MARCAR LEÍDA */
    const handleMarkRead = (rowMap, rowKey) => {
        if (rowMap[rowKey]) rowMap[rowKey].closeRow();

        const updated = notificaciones.map(n =>
            n.id === rowKey ? { ...n, leida: true } : n
        );

        updateNotifications(updated);
    };

    /** ELIMINAR */
    const handleDelete = (rowMap, rowKey) => {
        if (rowMap[rowKey]) rowMap[rowKey].closeRow();

        const updated = notificaciones.filter(n => n.id !== rowKey);
        updateNotifications(updated);
    };

    /** CARGA LOCAL + SERVIDOR + FILTRADO */
    useEffect(() => {
        const loadData = async () => {
            const local = await loadLocalNotifications();
            const installTime = await getInstallTime();

            try {
                const remote = await fetchNotifications();
                const normalized = normalizeApiData(remote);

                const filtered = normalized.filter(n => {
                    const nf = new Date(n.fecha);
                    return nf >= installTime;
                });

                const merged = [...local, ...filtered]
                    .reduce((acc, n) => {
                        if (!acc.some(x => x.id === n.id)) acc.push(n);
                        return acc;
                    }, [])
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

                updateNotifications(merged);
            } catch (e) {
                console.log("Error API, usando solo local");
                setNotificaciones(local);
            }

            setLoading(false);
        };

        loadData();
    }, []);

    /** PUSH EN TIEMPO REAL */
    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(n => {
            const { title, body, data } = n.request.content;

            const newNotif = {
                id: String(Date.now()),
                titulo: title || data?.titulo || "Nueva alerta",
                descripcion: body || data?.mensaje || "Mensaje recibido",
                fecha: new Date().toISOString(),
                tipo: (data?.type || "alerta").toLowerCase(),
                noticiaId: data?.id && data?.type === "noticia" ? data.id : null,
                encuestaId: data?.id && data?.type === "encuesta" ? data.id : null,
                leida: false,
            };

            const updated = [newNotif, ...notificaciones];
            updateNotifications(updated);
        });

        return () => subscription.remove();
    }, [notificaciones]);

    /** NAVEGACIÓN AL PRESIONAR NOTIFICACIÓN (CORREGIDO) */
    const onPressNotification = (item) => {
        // 1. Marcar como leída visualmente
        const updated = notificaciones.map(n =>
            n.id === item.id ? { ...n, leida: true } : n
        );
        updateNotifications(updated);

        console.log("Presionada:", item);

        const tipo = item.tipo.toLowerCase();

        // ✅ CORRECCIÓN: Navegación anidada hacia el Tab 'Noticias'
        if (tipo === "noticia" && item.noticiaId) {
            console.log("➡️ Navegando a noticia:", item.noticiaId);
            
            navigation.navigate("Noticias", {
                screen: "NewsDetail",
                params: { newsId: item.noticiaId } 
            });
            return;
        }

        // ✅ CORRECCIÓN: Navegación anidada hacia el Tab 'Encuestas'
        if (tipo === "encuesta" && item.encuestaId) {
            console.log("➡️ Navegando a encuesta:", item.encuestaId);
            
            navigation.navigate("Encuestas", {
                screen: "PollDetail",
                params: { 
                    encuestaId: item.encuestaId,
                    titulo: item.titulo || 'Encuesta'
                }
            });
            return;
        }

        console.log("Tipo sin navegación:", tipo);
    };

    /** Render Card */
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.card,
                item.leida ? styles.cardLeida : styles.cardNoLeida
            ]}
            onPress={() => onPressNotification(item)}
        >
            <Ionicons
                name="notifications-outline"
                size={26}
                color={item.leida ? "#999" : "#013D6B"}
                style={{ marginRight: 10 }}
            />

            <View style={{ flex: 1 }}>
                <Text style={[styles.titulo, item.leida && styles.textLeido]}>
                    {!item.leida && <Text style={{ color: "#013D6B" }}>● </Text>}
                    {item.titulo}
                </Text>

                <Text
                    style={[styles.descripcion, item.leida && styles.textLeido]}
                    numberOfLines={2}
                >
                    {item.descripcion}
                </Text>

                <Text style={[styles.fecha, item.leida && styles.textLeido]}>
                    {formatTimeAgo(item.fecha)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    /** Acciones Swipe */
    const renderHiddenItem = ({ item }, rowMap) => (
        <View style={styles.actionsRow}>
            <TouchableOpacity
                style={[styles.actionBtn, styles.readBtn]}
                onPress={() => handleMarkRead(rowMap, item.id)}
            >
                <Ionicons name="checkmark-done" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDelete(rowMap, item.id)}
            >
                <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#013D6B" />
                <Text style={{ marginTop: 10 }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Notificaciones</Text>

            <SwipeListView
                data={notificaciones}
                keyExtractor={(i) => i.id}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-150}
                disableRightSwipe={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        padding: 20,
        backgroundColor: "#fff",
    },
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        padding: 15,
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 12,
        elevation: 2,
    },
    cardNoLeida: {
        borderLeftWidth: 4,
        borderLeftColor: "#013D6B",
    },
    cardLeida: {
        borderLeftWidth: 4,
        borderLeftColor: "#ccc",
    },
    titulo: { fontSize: 16, fontWeight: "bold", color: "#333" },
    descripcion: { color: "#555", marginTop: 3 },
    fecha: { color: "#777", marginTop: 6, fontSize: 12 },
    textLeido: { color: "#999" },
    actionsRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: 15,
    },
    actionBtn: {
        width: 65,
        height: "80%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    readBtn: { backgroundColor: "#007AFF" },
    deleteBtn: { backgroundColor: "#D11A2A" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default NotificationsScreen;
import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet, 
    TouchableOpacity, 
    Image,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchNewsList } from '../api';

const BigCard = ({ item, onPress }) => {
    if (!item) return null;

    const formattedDate = item.publishedDate
        ? new Date(item.publishedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
        : 'Fecha desconocida';

    return (
        <TouchableOpacity style={styles.bigCard} onPress={onPress}>
            {item.headerPic && (
                <Image source={{ uri: item.headerPic }} style={styles.bigImage} />
            )}

            <View style={styles.bigContent}>
                <Text style={styles.bigTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bigLead} numberOfLines={3}>{item.lead}</Text>

                <View style={styles.bigFooter}>
                    <Text style={styles.bigDate}>{formattedDate}</Text>
                    <Text style={styles.readMore}>Leer más</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const NewsListScreen = () => {
    const navigation = useNavigation();
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadNoticias = async () => {
        if (!isRefreshing) setLoading(true);
        setError(null);

        try {
            const data = await fetchNewsList();
            setNoticias(data);
        } catch (err) {
            setError(err.message || "No se pudo obtener noticias.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadNoticias();
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadNoticias();
    }, []);

    const handlePress = (item) => {
        if (!item) return;
        navigation.navigate("NewsDetail", {
            newsId: item._id,
            title: item.title
        });
    };

    if (loading && !isRefreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#013D6B" />
                <Text style={styles.loadingText}>Cargando noticias...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={noticias}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.mainTitle}>Noticias</Text>
                        <Text style={styles.mainSubtitle}>Mantente informado con las últimas noticias</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <BigCard item={item} onPress={() => handlePress(item)} />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor="#013D6B"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Ionicons name="newspaper-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No hay noticias por el momento.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    listContent: { paddingBottom: 50, paddingTop: 35 },

    headerContainer: {
        paddingHorizontal: 15,
        marginBottom: 20,
        marginTop: 20,       // 🔥 esto baja el header
        paddingTop: 5,
    },

    mainTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#013D6B",
        marginBottom: 5
    },

    mainSubtitle: {
        fontSize: 16,
        color: "#555"
    },

    bigCard: {
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        marginHorizontal: 15,
    },

    bigImage: { width: "100%", height: 230 },

    bigContent: { padding: 15 },

    bigTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#013D6B",
        marginBottom: 8,
    },

    bigLead: {
        fontSize: 15,
        color: "#555",
        marginBottom: 10
    },

    bigFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },

    bigDate: {
        fontSize: 14,
        color: "#999",
    },

    readMore: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#013D6B",
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#333",
    },

    emptyText: {
        marginTop: 10,
        fontSize: 18,
        color: "#555",
        textAlign: "center",
    },
});

export default NewsListScreen;

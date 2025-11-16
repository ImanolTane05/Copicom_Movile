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

// Componente para la Noticia Destacada (el primer elemento)
const FeaturedNewsCard = ({ item, onPress }) => {
    const formattedDate = item.publishedDate ? 
        new Date(item.publishedDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : 
        'Fecha';

    return (
        <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
            {item.headerPic && (
                <Image source={{ uri: item.headerPic }} style={styles.featuredImage} />
            )}
            <View style={styles.featuredContent}>
                <Text style={styles.featuredTag}>DESTACADA</Text>
                <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.featuredLead} numberOfLines={3}>{item.lead}</Text>
                
                <View style={styles.featuredFooter}>
                    <Text style={styles.featuredDate}>{formattedDate}</Text>
                    <Text style={styles.readMore}>Leer más</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Componente para una Noticia Normal en la lista
const RegularNewsCard = ({ item, onPress }) => {
    const formattedDate = item.publishedDate ? 
        new Date(item.publishedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 
        'Fecha';

    return (
        <TouchableOpacity style={styles.regularCard} onPress={onPress}>
            <View style={styles.regularTextContent}>
                <Text style={styles.regularTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.regularLead} numberOfLines={2}>{item.lead}</Text>
                <Text style={styles.regularDate}>{formattedDate}</Text>
            </View>
            {item.headerPic && (
                <Image source={{ uri: item.headerPic }} style={styles.regularImage} />
            )}
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
            console.error("Error al cargar noticias:", err);
            setError(err.message || "No se pudo conectar al servidor.");
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
        navigation.navigate('NewsDetail', { 
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

    const featuredNews = noticias[0];
    const regularNews = noticias.slice(1);

    if (noticias.length === 0 && !loading) {
        return (
            <FlatList
                data={[]}
                keyExtractor={() => "empty"}
                renderItem={() => null}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#013D6B" />}
                ListEmptyComponent={
                    <View style={styles.centeredEmpty}>
                        <Ionicons name="newspaper-outline" size={50} color="#ccc" style={{ marginBottom: 10 }} />
                        <Text style={styles.emptyText}>No hay noticias publicadas en este momento.</Text>
                        {!!error && <Text style={styles.errorText}>Error: {error}</Text>}
                    </View>
                }
            />
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={regularNews}
                keyExtractor={item => item._id}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                         <Text style={styles.mainTitle}>Noticias</Text>
                         <Text style={styles.mainSubtitle}>Mantente informado con las últimas noticias</Text>
                        {featuredNews && (
                            <FeaturedNewsCard 
                                item={featuredNews} 
                                onPress={() => handlePress(featuredNews)} 
                            />
                        )}
                        <Text style={styles.sectionTitle}>Más Noticias</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <RegularNewsCard 
                        item={item} 
                        onPress={() => handlePress(item)} 
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#013D6B" />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    listContent: { paddingBottom: 80, paddingHorizontal: 10 },
    headerContainer: { paddingBottom: 15 },
    
    // --- Títulos de la Pantalla ---
    mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#013D6B', paddingHorizontal: 10, marginTop: 10 },
    mainSubtitle: { fontSize: 16, color: '#666', paddingHorizontal: 10, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', paddingHorizontal: 10, marginBottom: 10, marginTop: 10 },

    // --- Tarjeta Destacada ---
    featuredCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        marginHorizontal: 10,
    },
    featuredImage: {
        width: '100%',
        height: 200,
    },
    featuredContent: { padding: 15 },
    featuredTag: { 
        fontSize: 12, 
        fontWeight: 'bold', 
        color: '#fff', 
        backgroundColor: '#00A859', 
        paddingHorizontal: 8, 
        paddingVertical: 3, 
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    featuredTitle: { fontSize: 20, fontWeight: 'bold', color: '#013D6B', marginBottom: 5 },
    featuredLead: { fontSize: 14, color: '#555', marginBottom: 10 },
    featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    featuredDate: { fontSize: 14, color: '#999' },
    readMore: { fontSize: 14, fontWeight: 'bold', color: '#013D6B' },

    // --- Tarjeta Regular ---
    regularCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    regularTextContent: { flex: 1, paddingRight: 10 },
    regularImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginLeft: 5,
    },
    regularTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    regularLead: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 5 },
    regularDate: { fontSize: 12, color: '#999', textAlign: 'right' },

    // --- Estados ---
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
    centeredEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, height: '100%' },
    loadingText: { marginTop: 10, color: '#333', fontSize: 16 },
    emptyText: { fontSize: 18, color: '#555', textAlign: 'center' },
    errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 10 },
});

export default NewsListScreen;
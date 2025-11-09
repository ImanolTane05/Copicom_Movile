import React, { useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet, 
    TouchableOpacity,
    RefreshControl 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchEncuestasActivas } from '../api'; 

// Componente para renderizar cada item de la encuesta de forma optimizada
const PollItem = React.memo(({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={24} color="#013D6B" style={{ marginRight: 10 }} />
            <Text style={styles.title} numberOfLines={1}>{item.titulo || 'Encuesta sin título'}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
            {item.descripcion || 'Descripción no disponible.'}
        </Text>
        <View style={styles.footer}>
            <Text style={styles.questionCount}>{item.preguntas ? item.preguntas.length : 0} Preguntas</Text>
            <Ionicons name="arrow-forward-circle" size={24} color="#00A859" />
        </View>
    </TouchableOpacity>
));

const PollsListScreen = () => {
    const navigation = useNavigation();
    const [encuestas, setEncuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadEncuestas = async () => {
        // Establece loading y refreshing
        if (!isRefreshing) setLoading(true);
        setIsRefreshing(true);
        setError(null);
        try {
            const data = await fetchEncuestasActivas();
            const validEncuestas = data.filter(e => e.preguntas && Array.isArray(e.preguntas) && e.preguntas.length > 0);
            setEncuestas(validEncuestas);
        } catch (err) {
            console.error("Error al cargar encuestas:", err);
            setError(err.message || "No se pudo conectar al servidor. Verifica la API_BASE_URL.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    
    useFocusEffect(
        React.useCallback(() => {
            loadEncuestas();
            return () => {}; 
        }, [])
    );

    const handlePress = (encuesta) => {
        navigation.navigate('PollDetail', { 
            encuestaId: encuesta._id, 
            titulo: encuesta.titulo 
        });
    };

    const renderItem = ({ item }) => (
        <PollItem 
            item={item} 
            onPress={() => handlePress(item)} 
        />
    );


    if (loading && !isRefreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#013D6B" />
                <Text style={styles.loadingText}>Cargando lista de encuestas...</Text>
            </View>
        );
    }

 
    const emptyOrErrorContent = (
        <View style={styles.centeredEmpty}>
            {error ? (
                <>
                    <Text style={styles.errorText}>Error al cargar: {error}</Text>
                    <Text style={styles.tipText}>Intenta deslizar hacia abajo para recargar.</Text>
                </>
            ) : (
                <>
                    <Ionicons name="document-text-outline" size={50} color="#ccc" style={{ marginBottom: 10 }} />
                    <Text style={styles.emptyText}>No hay encuestas disponibles en este momento.</Text>
                    <Text style={styles.tipText}>Desliza hacia abajo para buscar nuevas encuestas.</Text>
                </>
            )}
        </View>
    );

    if (encuestas.length === 0 && !loading) {
        return (
            <FlatList
                data={[]}
                keyExtractor={() => "empty"}
                renderItem={() => null} 
                ListEmptyComponent={emptyOrErrorContent}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadEncuestas} tintColor="#013D6B" />}
            />
        );
    }
    
    // Lista de Encuestas
    return (
        <View style={styles.container}>
            <FlatList
                data={encuestas}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={loadEncuestas} tintColor="#013D6B" />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    listContent: { paddingTop: 10, paddingBottom: 80, paddingHorizontal: 10 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8f9fa' },
    centeredEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8f9fa', height: '100%' },
    loadingText: { marginTop: 10, color: '#333', fontSize: 16 },
    errorText: { color: 'red', fontSize: 18, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
    emptyText: { fontSize: 18, color: '#555', textAlign: 'center' },
    tipText: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 5 },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#00A859', 
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 18, fontWeight: '700', color: '#013D6B', flex: 1 },
    description: { fontSize: 14, color: '#555', marginBottom: 10 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    questionCount: { fontSize: 14, fontWeight: '600', color: '#777' },
});

export default PollsListScreen;

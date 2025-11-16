import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchNewsDetail } from '../api';
import RenderHtml from 'react-native-render-html'; // Para renderizar el cuerpo si es HTML

const { width } = Dimensions.get('window');

const NewsDetailScreen = ({ navigation }) => {
    const route = useRoute();
    const { newsId, title: initialTitle } = route.params || {}; 
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialTitle) navigation.setOptions({ title: initialTitle });

        const loadDetail = async () => {
            if (!newsId) {
                setError("ID de noticia no proporcionado.");
                setLoading(false);
                return;
            }
            try {
                const data = await fetchNewsDetail(newsId);
                setArticle(data);
                navigation.setOptions({ title: data.title || 'Detalle de Noticia' });
            } catch (err) {
                setError(err.message || "Ocurrió un error al cargar el artículo.");
            } finally {
                setLoading(false);
            }
        };

        loadDetail();
    }, [newsId, initialTitle, navigation]);
    
    // Configuración para RenderHtml
    const renderConfig = {
        baseStyle: { 
            fontSize: 16, 
            lineHeight: 24, 
            color: '#333' 
        },
        tagsStyles: {
            p: { marginBottom: 15 },
            h1: { fontSize: 24, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#013D6B' },
            h2: { fontSize: 20, fontWeight: 'bold', marginTop: 10, marginBottom: 8, color: '#013D6B' },
            img: { // Ajusta las imágenes para que se vean bien
                maxWidth: width - 40,
                height: 'auto',
                resizeMode: 'contain',
                marginVertical: 10
            }
        }
    };


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#013D6B" />
                <Text style={styles.text}>Cargando artículo...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    // Formatear la fecha
    const formattedDate = article?.publishedDate ? 
        new Date(article.publishedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 
        'Fecha desconocida';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.date}>Publicado el {formattedDate}</Text>
            
            {article.headerPic && (
                <Image 
                    source={{ uri: article.headerPic }} 
                    style={styles.headerImage} 
                    resizeMode="cover"
                />
            )}

            <Text style={styles.lead}>{article.lead}</Text>

            {/* Renderizar el cuerpo con RenderHtml (asumiendo que puede ser HTML) */}
            {article.body && (
                <View style={styles.bodyContainer}>
                     <RenderHtml
                        contentWidth={width}
                        source={{ html: article.body }}
                        tagsStyles={renderConfig.tagsStyles}
                        baseStyle={renderConfig.baseStyle}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20, paddingBottom: 50 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: '#013D6B', 
        marginBottom: 10 
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    headerImage: {
        width: '100%',
        height: 250, // Altura fija para la imagen destacada
        borderRadius: 8,
        marginBottom: 20,
    },
    lead: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        lineHeight: 28,
        borderLeftWidth: 4,
        borderLeftColor: '#00A859',
        paddingLeft: 10,
    },
    bodyContainer: {
        marginTop: 10,
    },
    text: { color: '#333', marginTop: 10 },
    errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});

export default NewsDetailScreen;
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchEncuestaById, submitRespuestas } from '../api'; 
import MultipleChoice from '../components/MultipleChoice';
import OpenText from '../components/OpenText';

const PollDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { encuestaId, titulo } = route.params || {}; 
  
  const [encuesta, setEncuesta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [respuestas, setRespuestas] = useState({}); 
  const [error, setError] = useState(null);

  // Configurar Título y Cargar Encuesta
  useEffect(() => {
    if (titulo) {
      navigation.setOptions({ title: titulo });
    }
    
    if (!encuestaId) {
        setError("No se recibió el ID de la encuesta para cargar.");
        setLoading(false);
        return;
    }

    const loadEncuesta = async () => {
      try {
        const data = await fetchEncuestaById(encuestaId);
        setEncuesta(data);
        setError(null); 

        const initialResponses = {};
        if (data.preguntas && Array.isArray(data.preguntas)) {
            data.preguntas.forEach(q => {
                const tipoPregunta = q.tipo ? q.tipo.toLowerCase().replace(/\s/g, '') : '';
                if (tipoPregunta === 'opciónmúltiple' || tipoPregunta === 'cerrada' || tipoPregunta === 'checkbox') {
                    initialResponses[q._id] = []; 
                } else { 
                    initialResponses[q._id] = ''; 
                }
            });
        }
        setRespuestas(initialResponses);

      } catch (err) {
        console.error("Error al cargar encuesta:", err);
        setError(err.message || "No se pudo cargar la encuesta. Revisa la conexión.");
      } finally {
        setLoading(false);
      }
    };
    loadEncuesta();
  }, [encuestaId, titulo, navigation]); 

  // 2. Handlers de Respuesta
  const handleOpenTextChange = useCallback((preguntaId, text) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: text }));
  }, []);

  const handleToggleOption = useCallback((preguntaId, option) => {
    setRespuestas(prev => {
      const currentOptions = Array.isArray(prev[preguntaId]) ? prev[preguntaId] : [];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter(o => o !== option)
        : [...currentOptions, option]; 
      return { ...prev, [preguntaId]: newOptions };
    });
  }, []);

  // Validación y Envío 
  const handleSubmit = async () => {
    if (!encuesta || !encuesta.preguntas) {
        Alert.alert("Error", "La encuesta no se ha cargado correctamente.");
        return;
    }

    let hasValidationError = false;
    const validationErrors = [];
    const respuestasParaEnviar = []; 

    if (Array.isArray(encuesta.preguntas)) {
        encuesta.preguntas.forEach(q => {
            const respuesta = respuestas[q._id];
            
            let isAnswered = true;
            if (
                !respuesta || 
                (Array.isArray(respuesta) && respuesta.length === 0) || 
                (typeof respuesta === 'string' && respuesta.trim() === '')
            ) {
                isAnswered = false;
            }

            if (q.obligatoria && !isAnswered) {
                hasValidationError = true;
                validationErrors.push(`- La pregunta "${q.texto}" es obligatoria.`);
            }

            
            if (isAnswered) {
                 respuestasParaEnviar.push({
                    preguntaId: q._id,
                    respuesta: Array.isArray(respuesta) ? respuesta.join(', ') : respuesta,
                 });
            }
        });
    }

    if (hasValidationError) {
      Alert.alert("Campos Obligatorios", validationErrors.join('\n'));
      return;
    }
    
    
    if (respuestasParaEnviar.length === 0) {
        Alert.alert("Sin respuestas", "Debes responder al menos una pregunta para poder enviar la encuesta.");
        return; 
    }

    setSubmitting(true);
    
    try {
      
      await submitRespuestas(encuestaId, respuestasParaEnviar); 

      Alert.alert(
        "¡Respuestas Enviadas!", 
        "Gracias por participar en nuestra encuesta. Sus respuestas fueron registradas con éxito.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error("Error al enviar:", err);
      Alert.alert("Error al Enviar", err.message || "Fallo la conexión con el servidor (¿IP correcta?).");
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizado
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#013D6B" />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (error || !encuesta) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "No se pudo cargar la encuesta."}</Text>
        <Text style={styles.helpText}>Verifica tu conexión y la API_BASE_URL en el archivo de constantes.</Text>
      </View>
    );
  }
  
  const preguntasExistentes = encuesta.preguntas && Array.isArray(encuesta.preguntas) && encuesta.preguntas.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pollTitle}>{encuesta.titulo}</Text>
        {encuesta.descripcion && <Text style={styles.pollDescription}>{encuesta.descripcion}</Text>}
        
        <Text style={styles.sectionTitle}>Responda las siguientes preguntas:</Text>

        {preguntasExistentes ? (
          encuesta.preguntas
            .sort((a, b) => (a.orden || 0) - (b.orden || 0)) 
            .map((pregunta) => {
              if (!pregunta || !pregunta._id) return null; 
              
              const tipoPregunta = pregunta.tipo ? pregunta.tipo.toLowerCase().replace(/\s/g, '') : '';
              
              if (tipoPregunta === 'opciónmúltiple' || tipoPregunta === 'cerrada' || tipoPregunta === 'checkbox' || tipoPregunta === 'radio') {
                return (
                  <MultipleChoice
                    key={pregunta._id}
                    pregunta={pregunta}
                    respuestaActual={respuestas[pregunta._id] || []} 
                    onToggleOption={handleToggleOption}
                  />
                );
              } else if (tipoPregunta === 'abierta' || tipoPregunta === 'texto') {
                return (
                  <OpenText
                    key={pregunta._id}
                    pregunta={pregunta}
                    respuestaActual={respuestas[pregunta._id] || ''} 
                    onChangeText={handleOpenTextChange}
                  />
                );
              }
              return ( <View key={pregunta._id} style={styles.unknownType}><Text style={styles.unknownText}>Tipo no soportado: {pregunta.tipo}</Text></View> );
            })
        ) : (
            <Text style={styles.errorText}>No se encontraron preguntas en esta encuesta.</Text>
        )}
        
        <TouchableOpacity
          style={submitting ? styles.submitButtonDisabled : styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting || !preguntasExistentes}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Subir respuestas</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  scrollContent: { paddingVertical: 20, paddingBottom: 50 },
  pollTitle: { fontSize: 24, fontWeight: 'bold', color: '#013D6B', textAlign: 'center', marginBottom: 5, paddingHorizontal: 15 },
  pollDescription: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 15, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#00A859', marginBottom: 10, paddingHorizontal: 15 },
  submitButton: { backgroundColor: '#013D6B', padding: 15, borderRadius: 8, marginHorizontal: 15, marginTop: 20, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: 'gray', padding: 15, borderRadius: 8, marginHorizontal: 15, marginTop: 20, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', padding: 20 },
  helpText: { color: '#555', fontSize: 14, textAlign: 'center', marginTop: 10 },
  loadingText: {marginTop: 10, color: '#333'},
  unknownType: { padding: 15, marginHorizontal: 15, backgroundColor: '#ffe0e0', borderRadius: 8, marginBottom: 20 },
  unknownText: { color: '#cc0000', fontWeight: 'bold' }
});

export default PollDetailScreen;
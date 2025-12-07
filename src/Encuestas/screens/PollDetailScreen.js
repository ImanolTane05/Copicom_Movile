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
import { useRoute } from '@react-navigation/native';
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

  // ✅ CARGA DE ENCUESTA
  useEffect(() => {
    if (titulo) navigation.setOptions({ title: titulo });

    if (!encuestaId) {
      setError("No se recibió el ID de la encuesta.");
      setLoading(false);
      return;
    }

    const loadEncuesta = async () => {
      try {
        const data = await fetchEncuestaById(encuestaId);
        setEncuesta(data);
        setError(null); 

        const initialResponses = {};

        data?.preguntas?.forEach(q => {
          const tipoPregunta = q.tipo?.toLowerCase().replace(/\s/g, '');

          if (tipoPregunta === 'opciónmúltiple' || tipoPregunta === 'checkbox') {
            initialResponses[q._id] = [];     // ✅ MULTIPLE
          } 
          else if (tipoPregunta === 'cerrada' || tipoPregunta === 'radio') {
            initialResponses[q._id] = null;   // ✅ CERRADA (UNA)
          } 
          else {
            initialResponses[q._id] = '';     // ✅ ABIERTA
          }
        });

        setRespuestas(initialResponses);
      } catch (err) {
        setError("No se pudo cargar la encuesta.");
      } finally {
        setLoading(false);
      }
    };

    loadEncuesta();
  }, [encuestaId, titulo, navigation]);

  // ✅ ABIERTA
  const handleOpenTextChange = useCallback((preguntaId, text) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: text }));
  }, []);

  // ✅ OPCIÓN MÚLTIPLE
  const handleMultipleOption = useCallback((preguntaId, option) => {
    setRespuestas(prev => {
      const current = Array.isArray(prev[preguntaId]) ? prev[preguntaId] : [];
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];

      return { ...prev, [preguntaId]: updated };
    });
  }, []);

  // ✅ CERRADA (UNA SOLA)
  const handleSingleOption = useCallback((preguntaId, option) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: option }));
  }, []);

  // ✅ ENVÍO
  const handleSubmit = async () => {
    let hasError = false;
    const errores = [];
    const respuestasParaEnviar = [];

    encuesta?.preguntas?.forEach(q => {
      const respuesta = respuestas[q._id];

      const vacia =
        respuesta === null ||
        respuesta === '' ||
        (Array.isArray(respuesta) && respuesta.length === 0);

      if (q.obligatoria && vacia) {
        hasError = true;
        errores.push(`- "${q.texto}" es obligatoria`);
      }

      if (!vacia) {
        respuestasParaEnviar.push({
          preguntaId: q._id,
          respuesta: Array.isArray(respuesta)
            ? respuesta.join(', ')
            : respuesta
        });
      }
    });

    if (hasError) {
      Alert.alert("Errores", errores.join('\n'));
      return;
    }

    setSubmitting(true);
    try {
      await submitRespuestas(encuestaId, respuestasParaEnviar);
      Alert.alert("✅ Enviado", "Gracias por responder", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch {
      Alert.alert("Error", "No se pudo enviar");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ RENDERS
  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#013D6B" />
      <Text>Cargando...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pollTitle}>{encuesta?.titulo}</Text>

        {encuesta?.preguntas?.map((pregunta) => {
          const tipo = pregunta.tipo?.toLowerCase().replace(/\s/g, '');

          // ✅ OPCIÓN MÚLTIPLE
          if (tipo === 'opciónmúltiple' || tipo === 'checkbox') {
            return (
              <MultipleChoice
                key={pregunta._id}
                pregunta={pregunta}
                respuestaActual={respuestas[pregunta._id] || []}
                onToggleOption={handleMultipleOption}
                multiple={true}
              />
            );
          }

          // ✅ CERRADA
          if (tipo === 'cerrada' || tipo === 'radio') {
            return (
              <MultipleChoice
                key={pregunta._id}
                pregunta={pregunta}
                respuestaActual={respuestas[pregunta._id]}
                onToggleOption={handleSingleOption}
                multiple={false}
              />
            );
          }

          // ✅ ABIERTA
          if (tipo === 'abierta') {
            return (
              <OpenText
                key={pregunta._id}
                pregunta={pregunta}
                respuestaActual={respuestas[pregunta._id]}
                onChangeText={handleOpenTextChange}
              />
            );
          }

          return null;
        })}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Enviando..." : "Enviar respuestas"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 50
  },

  pollTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#013D6B',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 15
  },

  submitButton: {
    backgroundColor: '#013D6B',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 25,
    alignItems: 'center'
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default PollDetailScreen;

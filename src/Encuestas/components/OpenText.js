import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const OpenText = ({ pregunta, onChangeText, respuestaActual }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.preguntaTexto}>
        {pregunta.texto}
        {pregunta.obligatoria && <Text style={styles.requiredText}> *</Text>}
      </Text>
      
      <TextInput
        style={styles.input}
        onChangeText={(text) => onChangeText(pregunta._id, text)}
        value={respuestaActual}
        placeholder="Escribe tu respuesta aquí..."
        multiline
        numberOfLines={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00A859',
  },
  preguntaTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  requiredText: {
    color: 'red',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    textAlignVertical: 'top',
  },
});

export default OpenText;
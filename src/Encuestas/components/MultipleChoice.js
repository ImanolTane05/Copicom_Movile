import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const MultipleChoice = ({ 
  pregunta, 
  respuestaActual, 
  onToggleOption, 
  multiple = true    // ✅ por defecto múltiple
}) => {

  // ✅ DETECTA SELECCIÓN CORRECTAMENTE SEGÚN EL TIPO
  const isSelected = (opcion) => {
    if (multiple) {
      return Array.isArray(respuestaActual) && respuestaActual.includes(opcion);
    } else {
      return respuestaActual === opcion;
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.preguntaTexto}>
        {pregunta.texto}
        {pregunta.obligatoria && <Text style={styles.requiredText}> *</Text>}
      </Text>

      {pregunta.opciones.map((opcion) => {
        const selected = isSelected(opcion);

        return (
          <TouchableOpacity
            key={opcion}
            style={[styles.optionButton, selected && styles.optionButtonSelected]}
            onPress={() => onToggleOption(pregunta._id, opcion)}
          >
            <View style={styles.checkboxContainer}>
              
              {/* ✅ ICONO CAMBIA SEGÚN TIPO */}
              <Icon 
                name={
                  multiple
                    ? selected 
                      ? "check-box" 
                      : "check-box-outline-blank"
                    : selected
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                }
                size={24}
                color={selected ? "#013D6B" : "#888"} 
              />

              <Text style={[
                styles.optionText, 
                selected && styles.optionTextSelected
              ]}>
                {opcion}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
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
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginBottom: 5,
  },
  optionButtonSelected: {
    backgroundColor: '#e6f7ff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#013D6B',
  }
});

export default MultipleChoice;

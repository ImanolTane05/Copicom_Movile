import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PollCard = ({ encuesta, onPress }) => {
  const fechaPublicacion = new Date(encuesta.fechaPublicacion).toLocaleDateString('es-MX');

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(encuesta)}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{encuesta.titulo}</Text>
        <Text style={styles.status}>
          <Ionicons name="checkmark-circle" size={16} color="#00A859" />
          {' Activa'}
        </Text>
      </View>
      <Text style={styles.date}>Fecha de publicación: {fechaPublicacion}</Text>
      <Text style={styles.intro} numberOfLines={2}>
        {encuesta.descripcion || 'Haz clic para ver los detalles y responder.'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 15,
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5, 
    borderLeftColor: '#013D6B', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#013D6B', 
    flexShrink: 1, 
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00A859',
    marginLeft: 10,
  },
  date: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  intro: {
    fontSize: 14,
    color: '#333',
  },
});

export default PollCard;
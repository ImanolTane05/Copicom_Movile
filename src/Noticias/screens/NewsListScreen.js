import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NewsListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noticias (Pestaña Principal)</Text>
      <Text>Aquí se implementará (Consultar Noticias).</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default NewsListScreen;
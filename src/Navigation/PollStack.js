import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PollsListScreen from '../Encuestas/screens/PollsListScreen';
import PollDetailScreen from '../Encuestas/screens/PollDetailScreen'; 

const Stack = createStackNavigator();

const PollStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="PollsList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#013D6B', 
        },
        headerTintColor: '#fff', 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="PollsList" 
        component={PollsListScreen} 
        options={{ title: 'Encuestas Activas' }} 
      />
      <Stack.Screen 
        name="PollDetail" 
        component={PollDetailScreen} 
        // El título se establecerá dinámicamente desde la pantalla de detalle
        options={{ title: 'Responder Encuesta' }} 
      />
    </Stack.Navigator>
  );
};

export default PollStack;
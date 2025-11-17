import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PollsListScreen from '../Encuestas/screens/PollsListScreen';
import PollDetailScreen from '../Encuestas/screens/PollDetailScreen';

const Stack = createNativeStackNavigator();

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
        options={{ title: 'Responder Encuesta' }}
      />
    </Stack.Navigator>
  );
};

export default PollStack;

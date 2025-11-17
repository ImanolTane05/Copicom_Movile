import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import NewsListScreen from '../Noticias/screens/NewsListScreen';
import NewsDetailScreen from '../Noticias/screens/NewsDetailScreen';

const Stack = createNativeStackNavigator();

const NewsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="NewsList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#013D6B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="NewsList"
        component={NewsListScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={({ navigation }) => ({
          title: 'Artículo Completo',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="close"
                size={28}
                color="#fff"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default NewsStack;

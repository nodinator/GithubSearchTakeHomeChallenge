import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../screens/Home';

const Stack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={{
          headerStyle: {
            backgroundColor: '#0066f1',
          },
          headerTintColor: '#fff',
          title: 'HOME',
          headerTitleStyle: {
            fontFamily: 'FjallaOne',
            fontSize: 24
          },
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

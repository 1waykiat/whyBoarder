import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createCompatNavigatorFactory } from '@react-navigation/compat';

import React from 'react';
import HomeScreen from './Screen/HomeScreen';
import ListScreen from './Screen/ListScreen';
import { View, Text, TouchableOpacity } from 'react-native';
import Styles from './Styles';


export default function App() {
  const Stack = createStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="List" component={ListScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
   );
}



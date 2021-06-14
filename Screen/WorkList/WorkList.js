import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import FixListScreen from './FixListScreen';
import FlexibleListScreen from './FlexibleListScreen';
import AgendaScreen from './AgendaScreen';
import ProfileScreen from '../ProfileScreen'; 

import { Feather } from '@expo/vector-icons';

export default function WorkList() {
  const Tab = createMaterialBottomTabNavigator();

  return (
        <Tab.Navigator 
          initialRouteName='FixList'
          shifting={true}
          activeColor="#24b1ed"
          barStyle={{backgroundColor: 'white'}}
        >
          <Tab.Screen 
            name="FixList" 
            component={FixListScreen}
            options={{
              tabBarLabel: 'Fixed',
              tabBarIcon: ({ color }) => (
                <Feather name="lock" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="FlexList"
            component={FlexibleListScreen}
            options={{
              tabBarLabel: 'Flex',
              tabBarIcon: ({ color }) => (
                <Feather name='list' size={24} color={color} />
              )
            }}  
          />
          <Tab.Screen 
            name="Agenda" 
            component={AgendaScreen}
            options={{
              tabBarLabel: 'Agenda',
              tabBarIcon: ( {color} ) => (
                <Feather name="calendar" size={24} color={color} />
              )
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ( {color} ) => (
                <Feather name="user" size={24} color={color} />
              )
            }}
          />
        </Tab.Navigator>
   );
}



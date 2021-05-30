import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FixListScreen from './FixListScreen';
import FlexibleListScreen from './FlexibleListScreen';

export default function WorkList() {
  const Tab = createBottomTabNavigator();

  return (
        <Tab.Navigator initialRouteName='FixList'>
          <Tab.Screen name="FixList" component={FixListScreen}/>
          <Tab.Screen name="FlexibleList" component={FlexibleListScreen}/>
        </Tab.Navigator>
   );
}



import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React, { useEffect } from 'react';
import HomeScreen from './Screen/HomeScreen';
import SignInScreen from './Screen/SignInScreen';
import SignUpScreen from './Screen/SignUpScreen';
import WorkList from './Screen/WorkList/WorkList';
import ForgotPasswordScreen from './Screen/ForgotPasswordScreen';
import EditScreen from './Screen/EditScreen';

import fb from "./api/Firebase";

import { Provider } from "react-redux";
import store from './store';


export default function App() {
  const Stack = createStackNavigator();

  useEffect(() => {
    const app = fb();
    return app; // unsubscribe on unmount
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="SignIn" component={SignInScreen}/>
          <Stack.Screen name="SignUp" component={SignUpScreen}/>
          <Stack.Screen name="WorkList" component={WorkList}/>
          <Stack.Screen name="Edit" component={EditScreen}/>
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
   );
}



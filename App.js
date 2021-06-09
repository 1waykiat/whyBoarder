import 'react-native-gesture-handler';
import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screen/HomeScreen';
import SignInScreen from './screen/SignInScreen';
import SignUpScreen from './screen/SignUpScreen';
import WorkList from './screen/WorkList/WorkList';
import ForgotPasswordScreen from './screen/ForgotPasswordScreen';
import EditScreen from './screen/EditScreen';

import { LogBox } from 'react-native';

import firebase from "./api/Firebase";

import { Provider } from "react-redux";
import store from './store';

import { Provider as PaperProvider} from "react-native-paper"

LogBox.ignoreLogs(['Setting a timer for a long period of time'])

export default function App() {
  const Stack = createStackNavigator();

  useEffect(() => {
    const app = () => firebase;
    return app; // unsubscribe on unmount
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
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
      </PaperProvider>
    </Provider>
   );
}



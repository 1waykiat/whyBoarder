import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import Styles from '../Styles';

export default function ListScreen( { navigation } ) {
    return (
    <View style={Styles().container}>
         <TouchableOpacity style={Styles().button}  onPress={() => navigation.goBack()}>
             <Text styles={Styles().text}>Exit</Text>
         </TouchableOpacity>
         <StatusBar style="auto" />
     </View>
    )
}
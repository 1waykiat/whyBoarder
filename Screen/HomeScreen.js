import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import Styles from '../Styles';

export default function HomeScreen( {navigation} ) {
    return (
    <View style={Styles().container}>
         <Text style={Styles().text} >whyBoarder</Text>
         <TouchableOpacity style={Styles.button} onPress={() => navigation.navigate('List')}>
             <Text style={Styles().text}>Enter</Text>
         </TouchableOpacity>
         <StatusBar style="auto" />
     </View>
    )
}
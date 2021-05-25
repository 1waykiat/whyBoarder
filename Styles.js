import { StyleSheet } from 'react-native';

export default function Styles() {
  return (
    StyleSheet.create({
      container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 20,
        margin: 20,
      },
      text: {
        alignContent: 'center',
        justifyContent: 'center',
        fontStyle: 'italic',
        fontSize: 20,
        backgroundColor: 'cyan',
      },
      button: {
        backgroundColor: 'cyan',
        justifyContent: 'center',
        alignContent: 'center',
        
      }
    })
  );
} 
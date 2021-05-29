/* eslint-disable react/prop-types */
import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'

const CoolButton = (props) => {
  return(
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress} >
      <Text style={styles.text}>{props.children}</Text>
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#003D7C',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  text: {
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    color: 'white',
    textAlign: 'center' 
  }
})

export default CoolButton
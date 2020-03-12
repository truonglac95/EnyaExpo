import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, 
  Dimensions, Platform, Alert } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {mS, mC} from '../constants/masterStyle';

export default class BasicButton extends Component {
  
  constructor (props) {
    super(props);
  }

  handleAlert = (todo, title) => {
    Alert.alert(
      title,
      todo,
      [{text: 'Ok'}],
      {cancelable: false},
    );
  }

  render() {
    
    const { text, onClick, leftEdge, topEdge, width, icon, 
      size, todo, title, key_process} = this.props;

    const defaultWidth = Dimensions.get('window').width * 0.7;
    
    let iOS = true;

    if (Platform.OS === 'android') {
      iOS = false
    } 

    return (
      <View>
        <TouchableOpacity 
          style={[styles.button, {
            width: (width || defaultWidth), 
            backgroundColor: key_process? mC.lightGray : mC.white,
            borderColor: key_process? mC.lightGray : mC.darkBlue}]} 
            onPress={key_process ? () => this.handleAlert("Initial key generation", "Be patient"): onClick}>
          <View style={styles.flex}> 
            {icon && iOS &&
              <View style={{marginRight: 10, marginTop: 3}}>
                <Ionicons
                  name={icon}
                  size={30}
                  color={mC.darkBlue}
                />
              </View>
            }
            {icon && !iOS &&
              <View style={{marginRight: 10, marginTop: 0}}>
                <Ionicons
                  name={icon}
                  size={30}
                  color={mC.darkBlue}
                />
              </View>
            }
            <Text style={[styles.buttonColorText, {
              fontSize: size || 16,
              color: mC.darkBlue}]}>{text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 40,
    backgroundColor: mC.white,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems:'center',
    borderWidth: 1,
    borderColor: mC.darkBlue,
  },
  buttonText: {
    textAlign: 'center',
    color: mC.darkBlue,
  },
});

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
      size, todo, title, enable, keys_ready } = this.props;

    const defaultWidth = Dimensions.get('window').width * 0.7;

    let iOS = true;
    if (Platform.OS === 'android') iOS = false

    let enabled = true;
    if (enable === false) {
      enabled = false
    }

    let error_title = 'Computing'
    let error_msg = 'Please wait until the current computation has finished.'

    //there is second reason to disable button...
    if (keys_ready === false) {
      error_title = 'No FHE keys'
      error_msg = 'To try Buffered FHE, you first need to generate several FHE keys. Please do so in the account tab.'
      enabled = false
    }

    return (
      <View>
        <TouchableOpacity 
          style={[styles.button, {
              width: (width || defaultWidth), 
              backgroundColor: enabled ? mC.white : mC.lightGray,
              borderColor: enabled ? mC.darkBlue : mC.lightGray
            }
          ]}
            onPress={!enabled ? () => this.handleAlert(error_msg, error_title) : onClick}>
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
                color: enabled ? mC.darkBlue : mC.white
              }]}>{text}
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

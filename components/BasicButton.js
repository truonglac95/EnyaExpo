import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';

import colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '../constants/Strings';

export default class BasicButton extends Component {
  
  constructor (props) {
    super(props);
  }

  handleAlert = (todo, title) => {
    Alert.alert(
      title,
      todo,
      [{text: i18n.t('global_ok')},],
      {cancelable: false},
    );
  }

  render() {
    
    const { text, onClick, leftEdge, topEdge, width, icon, 
      size, no_internet, todo, title} = this.props;

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
            backgroundColor: no_internet? colors.lighterGray : colors.buttonColorBack,
            borderColor: no_internet? colors.lightGray : colors.buttonColorBorder}]} 
          onPress={no_internet ? () => this.handleAlert(todo, title): onClick}>
          <View style={styles.flex}> 
            {icon && iOS &&
              <View style={{marginRight: 10, marginTop: 3}}>
                <Ionicons
                  name={icon}
                  size={30}
                  color={colors.buttonColorText}
                />
              </View>
            }
            {icon && !iOS &&
              <View style={{marginRight: 10, marginTop: 0}}>
                <Ionicons
                  name={icon}
                  size={30}
                  color={colors.buttonColorText}
                />
              </View>
            }
            <Text style={[styles.buttonColorText, {
              fontSize: size || 16,
              color: no_internet ? colors.lightGray : colors.buttonColorText}]}>{text}
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
    backgroundColor: colors.buttonColorBack,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems:'center',
    borderWidth: 1,
    borderColor: colors.buttonColorBorder,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.buttonColorText,
  },
});

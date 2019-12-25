import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';

export default class PasswordInput extends Component {
  
  constructor (props) {

    super(props);

    this.state = {
      show: false,
    };

  }

  render() {
    const { label, password, onChange } = this.props;
    const { show } = this.state;
    
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            value={password}
            secureTextEntry={!show}
            placeholder={i18n.t('global_password')}
            onChangeText={onChange}
          />
          <TouchableOpacity onPress={() => { this.setState({ show: !show }); }}>
            <Text style={styles.buttonText}>{show ? i18n.t('global_hide') : i18n.t('global_show')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGray,
  },
  label: {
    color: colors.darkGray,
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 3,
  },
  buttonText: {
    color: colors.buttonBlue,
    fontSize: 18,
    lineHeight: 40,
  },
});

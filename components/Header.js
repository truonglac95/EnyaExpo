import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, 
  Dimensions, Image } from 'react-native';

export default class Header extends Component {

  constructor (props) {
    super(props);
  }

  back = () => {
    this.props.navigation.onBack();
  }

  render() {

    const { title, back, height, navigation } = this.props;

    return (
      <View style={[styles.headerContainer, {height: (height || 90)}]}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {back && 
            <View style={[styles.back, {alignItems: 'flex-start'}]}>
              <TouchableOpacity 
                hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                onPress={this.back}
              >
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Ionicons
                  name="ios-arrow-back"
                  size={30}
                  color={'#33337F'}
                />
                <Text style={{fontSize: 18, paddingLeft: 5, paddingTop: 4, color: '#33337F'}}>Back</Text>
              </View>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 45,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderColor: '#33337F',
  },
  title: {
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 24,
    color: '#33337F',
  },
  back: {
    position: 'absolute',
    height: 30,
    width: 80, 
    left: 20,
    top: 0,
    zIndex: 9999,
  },
});

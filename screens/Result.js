import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Platform } from 'react-native';
import mS from '../constants/masterStyle';
import PDFReader from 'rn-pdf-reader-js';

import * as EnyaDeliver from '../EnyaSDK/EnyaDeliver'

class Report extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'Secure Report'}</Text>),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    this.state = {
      cryptoState: 'decrypting',
      isMounted: false,
    };

  }

  componentWillUnmount() {

    this.state.isMounted = false;
  
  }

  async componentDidMount() {

    this.setState({
      isMounted : true,
    }, () => {
      this.setState({cryptoState: 'decrypting'});
      EnyaDeliver.DecryptResult().then(decrypted64 => {
        if (this.state.isMounted) {
          this.setState({
            base64String: 'data:application/pdf;base64,' + decrypted64,
            cryptoState: 'display',
          });
        }
      })
    });

  };

  render() {
    
    const { base64String, cryptoState } = this.state;

    return (
      <View>
      {(cryptoState === 'decrypting') && 
      <View>
        <View style={styles.row}>
          <Text style={mS.mediumDarkFP}>{'Decrypting Report'}</Text>
          <Text style={mS.smallGrayFP}>{'Please wait...'}</Text>
        </View>
        <View style={[styles.containerProgress]}>
          <ActivityIndicator size="large" color='#33337F' />
        </View>
      </View>
      }
      {(cryptoState === 'display') && 
        <View style={styles.pdfReader}>
          <PDFReader source={{base64: base64String}}/>
        </View>
      }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  containerProgress: {
    marginTop: 300,
    marginLeft: 50,
    marginRight: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfReader: {
    position: 'absolute',
    left: 0,
    top: -10,
    width: '100%',
    height: (Platform.OS === 'android') ? Dimensions.get('window').height - 95 : Dimensions.get('window').height - 100,
  },
  row: {
    position: 'absolute',
    left: 0,
    top: 100,
    margin: 20,
  },
});

const mapStateToProps = state => ({});
export default connect(mapStateToProps)(Report);
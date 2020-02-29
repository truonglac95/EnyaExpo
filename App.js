import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/configureStore';

import { Icon, AppLoading } from 'expo';

import { Animated, Dimensions, Image, Text, View, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Platform } from 'react-native';

import GestureRecognizer from 'react-native-swipe-gestures';

import { Asset } from 'expo-asset';

import MainApp from './MainApp';
import BasicButton from './components/BasicButton';
import {mS, mC} from './constants/masterStyle';

import { SECURE_STORAGE_ACCOUNT } from './redux/constants';
import * as SecureStore from 'expo-secure-store'

const Slider = (props) => (
  <View style={mS.sliderVP}>
    {[0, 1, 2, 3].map(i => 
      <View key={i} style={[mS.dot, i === props.value && {backgroundColor: mC.darkBlue}]}/>
    )}
  </View>
);

export default class App extends React.Component {

  state = {
    isAppReady: false,
    active: 0,
    isLoaded: false,
  };
  
  constructor (props) {

    super(props);
  
  };

  UNSAFE_componentWillMount() {

    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(result => {
      if(result) {
        if (__DEV__) ('This is a signed-up user - no need to show value prop slides')
        this.setState({
          active: 4, // go straight to login window
        });
      } else {
        if (__DEV__) console.log('First sign up - show value prop slides')
      }
    });

  }

  moveOn = () => {
    this.setState({ active : this.state.active + 1 });
  }

  renderApp = (active) => {

    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 100
    };

    if (active === 0) {
      return (
        <GestureRecognizer 
          style={mS.containerCenter} 
          onSwipeLeft={() => { this.setState({ active: 1 }) }} 
          config={config}
        >
          <Image
            style={mS.valuePropVP}
            source={require('./assets/images/valueProp1.png')}
            onLoad={this._cacheResourcesAsync}
          />
          <View style={mS.msgBoxVP}>
            <Text style={mS.titleTextVP}>{'Enya\nSDK and API'}</Text>
            <Text style={mS.tagTextVP}>{'Secure Content Delivery and Computation'}</Text>
          </View>
          <Slider value={0}/>
          <BasicButton 
            text={'Next'} 
            onClick={this.moveOn} 
          />
        </GestureRecognizer>
      );
    }

    if (active === 1) {
      return (
        <GestureRecognizer 
          style={mS.containerCenter} 
          onSwipeLeft={() => { this.setState({ active: 2 }) }}
          onSwipeRight={() => { this.setState({ active: 0 }) }} 
          config={config}
        >
          <Image
            style={mS.valuePropVP}
            source={require('./assets/images/valueProp2.png')}
            onLoad={this._cacheResourcesAsync}
          />
          <View style={mS.msgBoxVP}>
            <Text style={mS.titleTextVP}>{'Private Computation'}</Text>
            <Text style={mS.tagTextVP}>{'Data we exchange with you are cryptographically split, processed, and recombined so your sensitive information stays private.'}</Text>
          </View>
          <Slider value={1} />
          <BasicButton 
            text={'Next'} 
            onClick={this.moveOn} 
          />
        </GestureRecognizer>
      );
    }

    if (active === 2) {
      return (
        <GestureRecognizer 
          style={mS.containerCenter} 
          onSwipeLeft={() => { this.setState({ active: 3 }) }}
          onSwipeRight={() => { this.setState({ active: 1 }) }} 
          config={config}
        >
          <Image
            style={mS.valuePropVP}
            source={require('./assets/images/valueProp3.png')}
            onLoad={this._cacheResourcesAsync}
          />
          <View style={mS.msgBoxVP}>
            <Text style={mS.titleTextVP}>{'Create an Account'}</Text>
            <Text style={mS.tagTextVP}>{'by scanning your QR key card and setting your password.'}</Text>
          </View>
          <Slider value={2} />
          <BasicButton 
            text={'Next'} 
            onClick={this.moveOn} 
          />
        </GestureRecognizer>
      );
    }

    if (active === 3) {
      return (
        <GestureRecognizer 
          style={mS.containerCenter} 
          onSwipeLeft={() => { this.setState({ active: 4 }) }}
          onSwipeRight={() => { this.setState({ active: 2 }) }} 
          config={config}
        >
          <Image
            style={mS.valuePropVP}
            source={require('./assets/images/valueProp4.png')}
            onLoad={this._cacheResourcesAsync}
          />
          <View style={mS.msgBoxVP}>
            <Text style={mS.titleTextVP}>{'Your QR key card'}</Text>
            <Text style={mS.tagTextVP}>{'allows only you to access your results.'}</Text>
          </View>
          <Slider value={3} />
          <BasicButton 
            text={'Sign up'} 
            onClick={this.moveOn} 
          />
        </GestureRecognizer>
      );
    }

    // all is ready!
    return (
      <Provider store={store}>
        <MainApp onWipeOut={()=>{this.setState({active: 0})}}/>
      </Provider>
    );
  }

  
  render() {

    return (
      <View style={{flex: 1}}>
        {this.renderApp(this.state.active)}
      </View>
    );
  }

  _cacheResourcesAsync = async () => {

    const images = [
      require('./assets/images/logo.png'),
      require('./assets/images/id.png'),
      require('./assets/images/valueProp1.png'),
      require('./assets/images/valueProp2.png'),
      require('./assets/images/valueProp3.png'),
      require('./assets/images/valueProp4.png'),
      require('./assets/images/nav/nav_home_g.png'),
      require('./assets/images/nav/nav_home_b.png'),
      require('./assets/images/nav/nav_me_g.png'),
      require('./assets/images/nav/nav_me_b.png')
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);

    this.setState({ isAppReady: true });
  }

}
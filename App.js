import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/configureStore';

import { Icon, AppLoading, SplashScreen } from 'expo';

import { Animated, Dimensions, Image, Text, View, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Platform } from 'react-native';

import GestureRecognizer from 'react-native-swipe-gestures';

import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

import MainApp from './MainApp';
import BasicButton from './components/BasicButton';
import SplashLoader from './components/SplashLoader';
import colors from './constants/Colors';
import i18n from './constants/Strings';
import mS from './constants/masterStyle';

import * as SecureStore from 'expo-secure-store'
import { SECURE_STORAGE_USER_FLOW } from './redux/constants';

const Slider = (props) => (
  <View style={mS.sliderVP}>
    {[0, 1, 2, 3].map(i => 
      <View key={i} style={[styles.dot, i === props.value && { backgroundColor: colors.BDred }]}/>
    )}
  </View>
);

export default class App extends React.Component {

  state = {
    isSplashReady: false,
    isAppReady: false,
    active: 0,
    isLoaded: false,
  };
  
  constructor (props) {

    super(props);
  
  };

  UNSAFE_componentWillMount() {

    SecureStore.getItemAsync(SECURE_STORAGE_USER_FLOW).then(result => {
      if(result) {
        if (__DEV__) ('This is a signed up user - no need to show value prop slides')
        this.setState({
          active: 4, // go straight to login window
        });
      } else {
        if (__DEV__) console.log('First sign up - show value prop slides')
      }
    });

  }

  componentDidMount() {

    SplashScreen.preventAutoHide();

  }

  moveOn = () => {

    this.setState({ 
      active : this.state.active + 1, 
    });

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
            <Text style={mS.titleTextVP}>{i18n.t('app_blockdoc_precision_health')}</Text>
            <Text style={mS.tagTextVP}>{i18n.t('app_blockdoc')}</Text>
          </View>
          <Slider value={0}/>
          <BasicButton 
            text={i18n.t('app_next')} 
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
            <Text style={mS.titleTextVP}>{i18n.t('app_MPC_title')}</Text>
            <Text style={mS.tagTextVP}>{i18n.t('app_MPC_content')}</Text>
          </View>
          <Slider value={1} />
          <BasicButton 
            text={i18n.t('app_next')} 
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
            <Text style={mS.titleTextVP}>{i18n.t('app_key_card')}</Text>
            <Text style={mS.tagTextVP}>{i18n.t('app_key_access')}</Text>
          </View>
          <Slider value={2} />
          <BasicButton 
            text={i18n.t('app_next')} 
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
            <Text style={mS.titleTextVP}>{i18n.t('app_create_account')}</Text>
            <Text style={mS.tagTextVP}>{i18n.t('app_scan_card')}</Text>
          </View>
          <Slider value={3} />
          <BasicButton 
            text={i18n.t('app_sign_up')} 
            onClick={this.moveOn} 
          />
        </GestureRecognizer>
      );
    }

    // all is ready!
    return (
      <Provider store={store}>
        <MainApp onWipeOut={() => { this.setState({ active: 0 }); }}/>
      </Provider>
    );
  }

  
  render() {

    const { active, isSplashReady, isAppReady } = this.state;

    if (!isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => {
            this.setState({ isSplashReady: true });
            this._cacheResourcesAsync();
          }}
          onError={console.warn}
          autoHideSplash={false}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        {Platform.OS === 'ios' && 
          <SplashLoader
            isLoaded={isAppReady && isSplashReady}
            imageSource={require('./assets/images/logo.png')}
            backgroundStyle={styles.loadingBackgroundStyle}
          >
            {this.renderApp(active)}
          </SplashLoader>
        }
        {Platform.OS === 'android' && 
          <View 
            style={{ flex: 1}}
          >
            {this.renderApp(active)}
          </View>
        }
      </View>
    );
  }

  _cacheSplashResourcesAsync = async () => {

    await Font.loadAsync({
      'montserratSB': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    });

    const png = require('./assets/images/logo.png');

    return Asset.fromModule(png).downloadAsync()
  }

  _cacheResourcesAsync = async () => {

    SplashScreen.hide();
    
    const images = [
      require('./assets/images/logo.png'),
      require('./assets/images/valueProp1.png'),
      require('./assets/images/valueProp2.png'),
      require('./assets/images/valueProp3.png'),
      require('./assets/images/valueProp4.png'),
      require('./assets/images/bdchat.png'),
      require('./assets/images/avatar.png'),
      require('./assets/images/nav/nav_genes_g.png'),
      require('./assets/images/nav/nav_home_g.png'),
      require('./assets/images/nav/nav_me_g.png'),
      require('./assets/images/nav/nav_support_g.png'),
      require('./assets/images/nav/nav_genes_b.png'),
      require('./assets/images/nav/nav_home_b.png'),
      require('./assets/images/nav/nav_me_b.png'),
      require('./assets/images/nav/nav_support_b.png'),
      require('./assets/images/id.png')
    ];

    await Font.loadAsync({
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'roboto': require('./assets/fonts/RobotoMono-Regular.ttf'),
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
      'montserratB': require('./assets/fonts/Montserrat-Bold.ttf'),
    });

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    this.setState({ isAppReady: true });
  }

}  

const styles = StyleSheet.create({
  loadingIndicator: {
    width: 100,
    height: 90,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colors.lightGray,
  },
  loadingBackgroundStyle: {
    backgroundColor: colors.BDred,
  },
});

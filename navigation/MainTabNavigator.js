import React from 'react';
import { connect } from 'react-redux';
import { Platform, View, Text, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';

import colors from '../constants/Colors';
import i18n from '../constants/Strings';

/* App overview */
import HomeScreen from '../screens/HomeScreen';

/* Collect data */
import QuestionnaireBasicScreen from '../screens/QuestionnaireScreenBasic';

/* Results */
import ResultFRSScreen from '../screens/ResultFRSScreen';
import ResultDNAScreen from '../screens/ResultDNAScreen';

/* User actions */
import AccountScreen from '../screens/AccountScreen';
import AccountDeleteScreen from '../screens/AccountDeleteScreen';
import AccountDeletedScreen from '../screens/AccountDeletedScreen';

const Label = (props) => (
  <Text style={[styles.tabText, { color: (props.focused ? colors.headerFontColor : colors.gray) }]}>
    {props.text}
  </Text>
);

const TabImage = (props) => (
  <Image 
    style={{
      width: 28, 
      height: 28, 
      marginTop: (Platform.OS === 'android') ? 10 : 0,
      marginBottom: 0,
      paddingBottom: 0,
      marginLeft: 'auto', 
      marginRight: 'auto'
    }} 
      source={props.image}
  />
);

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Qbasic: QuestionnaireBasicScreen,
    Qcardio: QuestionnaireCardioScreen,
    ResultFRS: ResultFRSScreen,
    ResultDNA: ResultDNAScreen,
  }, 
  {
    defaultNavigationOptions: {
      headerTintColor: colors.headerFontColor,
    },
  }
);

HomeStack.navigationOptions = ({ navigation }) => {
  
  let tabBarVisible = true;

  const { routeName } = navigation.state.routes[navigation.state.index];

  if (routeName === 'ResultDNA') {
    tabBarVisible = false;
  } else if (routeName === 'ResultFRS') {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: ({ focused }) => <Label text={i18n.t('tab_home')} focused={focused} />,
    tabBarIcon: ({ focused }) => (
      <TabImage 
        image={!focused ? require('../assets/images/nav/nav_home_g.png') : require('../assets/images/nav/nav_home_b.png')}
      />
    ),
    tabBarVisible,
  };
};

const DNAStack = createStackNavigator(
{
  ResultDNA: {
    screen: ResultDNAScreen,
    navigationOptions: ({navigation}) => ({
      headerLeft: 
        <HeaderBackButton 
          tintColor={colors.headerFontColor}
          backTitleVisible={true}
          onPress={() => navigation.goBack(null)} 
        />
    })
  },
}, 
{
  defaultNavigationOptions: {
    headerTintColor: colors.headerFontColor,
  },
});

DNAStack.navigationOptions = ({ navigation }) => {
  
  let tabBarVisible = true;

  const { routeName } = navigation.state.routes[navigation.state.index];

  if (routeName === 'ResultDNA') {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: ({ focused }) => <Label text={i18n.t('tab_genes')} focused={focused} />,
    tabBarIcon: ({ focused }) => (
      <TabImage 
        image={!focused ? require('../assets/images/nav/nav_genes_g.png') : require('../assets/images/nav/nav_genes_b.png')}
      />),
    tabBarVisible,
  };
};

const AccountStack = createStackNavigator(
{
  Account: {
    screen: AccountScreen,
    navigationOptions: ({navigation}) => ({
      headerLeft: 
        <HeaderBackButton 
          tintColor={colors.headerFontColor}
          backTitleVisible={true}
          onPress={() => navigation.goBack(null)} 
        />
    })
  },
  AccountDelete: AccountDeleteScreen,
  AccountDeleted: AccountDeletedScreen,
},
{
  defaultNavigationOptions: {
    headerTintColor: colors.headerFontColor,
  },
});

AccountStack.navigationOptions = ({ navigation }) => {
  
  let tabBarVisible = true;

  return {
    tabBarLabel: ({ focused }) => <Label text={i18n.t('tab_settings')} focused={focused} />,
    tabBarIcon: ({ focused }) => (
      <TabImage 
        image={!focused ? require('../assets/images/nav/nav_me_g.png') : require('../assets/images/nav/nav_me_b.png')}
      />),
    tabBarVisible,
  };
};

const styles = StyleSheet.create({
  tabText: {
    fontSize: 12,
    fontFamily: colors.tabFont,
    marginLeft: 'auto', 
    marginRight: 'auto'
  },
});

export default createBottomTabNavigator(
  {
    HomeStack,
    DNAStack,
    AccountStack,
  }, 
  {
  resetOnBlur: true,
  }
);

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
});
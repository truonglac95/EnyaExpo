import React from 'react';
import { connect } from 'react-redux';
import { Platform, View, Text, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';

import colors from '../constants/Colors';

/* App overview */
import Home from '../screens/Home';

/* Collect data */
import Questionnaire from '../screens/Questionnaire';

/* Results */
import ResultSMC from '../screens/ResultSMC';
import Result from '../screens/Result';

/* User actions */
import Account from '../screens/Account';
import AccountDelete from '../screens/AccountDelete';
import AccountDeleted from '../screens/AccountDeleted';

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
    Home: Home,
    Questionnaire: Questionnaire,
    ResultSMC: ResultSMC,
    Result: Result,
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

  if (routeName === 'Result') {
    tabBarVisible = false;
  } else if (routeName === 'ResultSMC') {
    tabBarVisible = false;
  }

  return {
    tabBarLabel: ({ focused }) => <Label text={'Home'} focused={focused} />,
    tabBarIcon: ({ focused }) => (
      <TabImage 
        image={!focused ? require('../assets/images/nav/nav_home_g.png') : require('../assets/images/nav/nav_home_b.png')}
      />
    ),
    tabBarVisible,
  };
};

const AccountStack = createStackNavigator(
{
  Account: {
    screen: Account,
    navigationOptions: ({navigation}) => ({
      headerLeft: 
        <HeaderBackButton 
          tintColor={colors.headerFontColor}
          backTitleVisible={true}
          onPress={() => navigation.goBack(null)} 
        />
    })
  },
  AccountDelete: AccountDelete,
  AccountDeleted: AccountDeleted,
},
{
  defaultNavigationOptions: {
    headerTintColor: colors.headerFontColor,
  },
});

AccountStack.navigationOptions = ({ navigation }) => {
  
  let tabBarVisible = true;

  return {
    tabBarLabel: ({ focused }) => <Label text={'Account'} focused={focused} />,
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
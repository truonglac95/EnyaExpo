import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';

const RootStack = createSwitchNavigator(
	{
    	Main: MainTabNavigator,
	},
	{
		initialRouteName: 'Main',
  	}
);

const App = createAppContainer(RootStack);

export default App;
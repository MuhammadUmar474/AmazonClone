import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import { color } from 'react-native-reanimated';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const BottomTabNav = () => {
    return (
        <Tab.Navigator tabBarOptions={{showLabel: false, inactiveBackgroundColor: '#ffbd7d', activeTintColor: '#e47911'}}>
            <Tab.Screen 
            component={HomeStack} 
            name="Home"
            options={{
                tabBarIcon: ({color}) => (
                    <Entypo name="home" color={color} size={19} />
                )
            }}
            />
            <Tab.Screen 
            component={HomeScreen} 
            name='profile'
            options={{
                tabBarIcon: ({color}) => (
                    <Entypo name="user" color={color} size={19} />
                )
            }}/>
            <Tab.Screen 
            component={ShoppingCartScreen} 
            name='ShoppingCart'
            options={{
                tabBarIcon: ({color}) => (
                    <Entypo name="shopping-cart" color={color} size={19} />
                )
            }}/>
            <Tab.Screen 
            component={HomeScreen} 
            name='more'
            options={{
                tabBarIcon: ({color}) => (
                    <Entypo name="menu" color={color} size={19} />
                )
            }}/>
        </Tab.Navigator>
    )
}

export default BottomTabNav;

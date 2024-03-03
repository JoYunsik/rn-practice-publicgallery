import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MyProfileScreen from './MyProfileScreen';

const Stack = createNativeStackNavigator();

const MyProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='MyProfile' component={MyProfileScreen}/>
        </Stack.Navigator>
    )
}

export default MyProfileStack
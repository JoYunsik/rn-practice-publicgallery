import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FeedScreen from './FeedScreen'

const Stack = createNativeStackNavigator()

const HomeStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Feed' component={FeedScreen}/>
    </Stack.Navigator>
  )
}

export default HomeStack
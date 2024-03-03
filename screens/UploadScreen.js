import { View, Text, useWindowDimensions, Image, TextInput, StyleSheet, Keyboard, Animated, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import IconRightButton from '../components/IconRightButton';
import {v4} from 'uuid'
import { createPost } from '../lib/post';
import { useUserContext } from '../Context/UserContext';
import storage from '@react-native-firebase/storage'

const UploadScreen = () => {
    const route = useRoute();
    const {res} = route.params ||  {};
    const {width} = useWindowDimensions();
    const animation = useRef(new Animated.Value(width)).current;
    const [isKeyboardOpen, SetIsKeyboardOpen] = useState(false);
    const [description, setDescription] = useState('');
    const navigation = useNavigation();
    const {user} = useUserContext();

    const onSubmit = useCallback(async ()=>{
      navigation.pop();
      const asset = res.assets[0];
      const extension = asset.fileName.split('.').pop();
      const reference = storage().ref(`/photo/${user.id}/${v4()}.${extension}`);
      if (Platform.OS === 'android') {
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        })
      } else {
        await reference.putfile(asset.uri)
      }
      const photoURL = await reference.getDownloadURL();
      await createPost({description, photoURL, user})
    },[res, user, description, navigation])

    useEffect(()=>{
        const didShow = Keyboard.addListener('keyboardDidShow', ()=>{SetIsKeyboardOpen(true)})
        const didHide = Keyboard.addListener('keyboardDidHide',()=>{SetIsKeyboardOpen(false)})
    },[])

    useEffect(()=>{
        Animated.timing(animation,{
            toValue: isKeyboardOpen? 0 : width,
            useNativeDriver: false,
            duration:150,
            delay: 100
        }).start()
    },[isKeyboardOpen,width,animation])

    useEffect(()=>{
        navigation.setOptions({
            headerRight:()=><IconRightButton onPress={onSubmit} name='send'/>
        })
    },[navigation, onSubmit])
    return (
      <KeyboardAvoidingView
      //아이폰을 위한 설정
      behavior={Platform.select({ios:'height'})} 
      style={styles.block}
      keyboardVerticalOffset={Platform.select({ios:180})}
      >
        <Animated.Image 
            source={{uri:res.assets[0]?.uri}}
            style={[styles.image, {height:animation}]}
            resizeMode='cover'
        />
        <TextInput 
            style={styles.input}
            multiline={true}
            placeholder='이 사진에 대한 설명을 적어주세요...'
            textAlignVertical='top'
            value={description}
            onChangeText={setDescription}
        />
      </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    block: {
      flex: 1,
    },
    image: {width: '100%'},
    input: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
      flex: 1,
      fontSize: 16,
    },
  });

export default UploadScreen;
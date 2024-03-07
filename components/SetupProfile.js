import { View, Text, StyleSheet, Platform, Pressable, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { createUser } from '../lib/users';
import { signOut } from '../lib/auth';
import CustomButton from './CustomButton';
import BorderedInput from './BorderedInput';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUserContext } from '../Context/UserContext';
import storage from '@react-native-firebase/storage'
import {Buffer} from 'buffer'
import Avatar from './Avatar';

const SetupProfile = () => {
    const [displayName, setDisplayName] =useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const {setUser} = useUserContext();
    const [response, setResponse] = useState(null);
    const {params} = useRoute();
    const {uid} = params || {};

    const onSubmit =async ()=>{
        setLoading(true)
        let photoURL = null;
        if (response) {
            const asset = response.assets[0];
            const extension = asset.fileName.split('.').pop(); // 확장자 추출
            const reference = storage().ref(`/profile/${uid}.${extension}`);
   
            if (Platform.OS === 'android') { 
              await reference.putString(asset.base64, 'base64', {
                contentType: asset.type,
              });
            } else {
              await reference.putFile(asset.uri);
            }
      
            photoURL = response ? await reference.getDownloadURL() : null;
        }

        
        const user = {
            id:uid,
            displayName,
            photoURL
        }
        createUser(user)
        setUser(user)
    }
    const onCancel = ()=>{
        signOut();
        navigation.goBack();
    }
    const onSelectImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 512,
                maxHeight: 512,
                includeBase64: Platform.OS === 'android',
            },
            (res)=>{
                if(res.didCancel){
                    return
                }
                setResponse(res);
            }
        )
    }

    return (
      <View style={styles.block}>
        <Pressable onPress={onSelectImage}>
            <Avatar source={response && {uri: response.uri} } size={128}/>
        </Pressable>
        <View style={styles.form}>
            <BorderedInput
                placeholder='닉네임'
                value={displayName}
                onChangeText={setDisplayName}
                onSubmitEditing={onSubmit}
                returnKeyType='next'
            />
            {loading? (
                <ActivityIndicator size={32} color='#6200ee' style={styles.spinner}/>
            ) :(
                <View style={styles.buttons}>
                    <CustomButton title='다음' onPress={onSubmit} hasMarginBottom/>
                    <CustomButton title='취소' onPress={onCancel} theme='secondary'/>
                </View>
            )}
            
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    block: {
      alignItems: 'center',
      marginTop: 24,
      paddingHorizontal: 16,
      width: '100%',
    },
    circle: {
      backgroundColor: '#cdcdcd',
      borderRadius: 64,
      width: 128,
      height: 128,
    },
    form: {
      marginTop: 16,
      width: '100%',
    },
    buttons: {
      marginTop: 48,
    },
    spinner: {
      marginTop: 48,
      height: 104,
    },
  });

export default SetupProfile
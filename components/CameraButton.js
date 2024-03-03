import { View, Text, StyleSheet, Platform, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons'
import UploadModal from './UploadModeModal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const TABBAR_HEIGHT = 49;

const imagePickerOption = {
    mediaType: 'photo',
    maxWidth: 768,
    maxHeight: 768,
    includeBase64: Platform.OS === 'android',
}

const CameraButton = () => {
    const insets = useSafeAreaInsets();
    const bottom = Platform.select({
        android: TABBAR_HEIGHT/2,
        ios : TABBAR_HEIGHT/2 + insets.bottom - 4,
    })
    const [modalVisible, setModalVisible] = useState(false)
    const navigation = useNavigation();

    const onPickImage = (res) => {
        if(res.didCancel||!res){
            return
        }
        navigation.push('Upload',{res})
    }

    const onLaunchCamera = () => {
        launchCamera(imagePickerOption, onPickImage)
    }
    const onLaunchImageLibrary = () => {
        launchImageLibrary(imagePickerOption, onPickImage)
    }

    return (
        <>
            <View style={[styles.wrapper, {bottom}]}>
                <Pressable
                    android_ripple={{
                        color:'#ffffff'
                    }}
                    style={styles.circle}
                    onPress={()=>setModalVisible(true)}
                >
                    <Icon name='camera-alt' color='white' size={24}/>
                </Pressable>
            </View>
            <UploadModal
                visible={modalVisible}
                onClose={()=>setModalVisible(false)}
                onLaunchCamera={onLaunchCamera}
                onLaunchImageLibrary={onLaunchImageLibrary}
            />
        </>
      
  )
}

export default CameraButton

const styles = StyleSheet.create({
    wrapper: {
      zIndex: 5,
      borderRadius: 27,
      height: 54,
      width: 54,
      position: 'absolute',
      left: '50%',
      transform: [
        {
          translateX: -27,
        },
      ],
      ...Platform.select({
        ios: {
          shadowColor: '#4d4d4d',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 5,
          overflow: 'hidden',
        },
      }),
    },
    circle: {
      backgroundColor: '#6200ee',
      borderRadius: 27,
      height: 54,
      width: 54,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
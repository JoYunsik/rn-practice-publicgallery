import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BorderedInput from '../components/BorderedInput'
import CustomButton from '../components/CustomButton'
import SignInForm from '../components/SignInForm'
import SignButtons from '../components/SignButtons'
import { signUp, signIn } from '../lib/auth'
import { getUser } from '../lib/users'
import { useUserContext } from '../Context/UserContext'

const SigninScreen = ({navigation, route}) => {
    const {isSignUp} = route.params ?? {}
    const [form, setForm] = useState({
        email:'',
        password:'',
        confirmPassword:'',
    })
    const [loading,setLoading] = useState();
    const {setUser} = useUserContext();

    const createChangeTextHandler =(name)=>(value)=>{
        setForm({...form,[name]:value})
    }
    const onSubmit = async ()=>{
        Keyboard.dismiss();
        const {email, password,confirmPassword} = form;
        
        if(isSignUp && password!==confirmPassword){
            Alert.alert('실패','비밀번호가 일치하지 않습니다.')
            return;
        }

        setLoading(true);
        const info = {email,password};
        try {
            const {user} = isSignUp ?  await signUp(info) : await signIn(info)
            const profile = await getUser(user.uid);
            if(!profile){
                navigation.navigate('Welcome',{uid:user.uid})
            } else{
                setUser(profile)
            }
        } catch(e){
            console.log(e)
            const messages = {
                'auth/email-already-in-use': '이미 가입된 이메일입니다.',
                'auth/wrong-password': '잘못된 비밀번호입니다.',
                'auth/user-not-found': '존재하지 않는 계정입니다.',
                'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
            };
            console.log(e)
            const msg = messages[e.code] || `${isSignUp ? '가입' : '로그인'} 실패`;
            Alert.alert('실패', msg);
        } finally {
            setLoading(false)
        }
    }
    return (
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.select({ios:'padding'})}>
            <SafeAreaView style={styles.fullscreen}>
                <Text style={styles.text}>PublicGallery</Text>
                <View style={styles.form}>
                    <SignInForm
                        isSignUp={isSignUp}
                        onSubmit={onSubmit}
                        form={form}
                        createChangeTextHandler={createChangeTextHandler}
                    />
                    <SignButtons isSignUp={isSignUp} onSubmit={onSubmit} loading={loading}/>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default SigninScreen

const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
  
    fullscreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    form: {
      marginTop: 64,
      width: '100%',
      paddingHorizontal: 16,
    },
    buttons:{
        marginTop:64,
    }
  });
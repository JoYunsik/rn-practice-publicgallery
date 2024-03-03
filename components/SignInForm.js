import React, { useRef } from "react";
import BorderedInput from "./BorderedInput";

const SignInForm = ({isSignUp, onSubmit, form, createChangeTextHandler})=>{
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    return(
        <>
            <BorderedInput 
                hasMarginBottom 
                placeholder='로그인' 
                value={form.email} 
                onChangeText={createChangeTextHandler('email')}
                autoCapitalize='none'
                autoCorrect={false}
                autoCompleteType='email'
                keyboardType='email-address'
                returnKeyType='next'
                onSubmitEditing={()=>passwordRef.current.focus()}
            />
            <BorderedInput 
                hasMarginBottom={isSignUp} 
                placeholder='비밀번호'
                value={form.password}
                onChangeText={createChangeTextHandler('password')}
                secureTextEntry
                ref={passwordRef}
                returnKeyType={isSignUp? 'next' : 'done'}
                onSubmitEditing = {()=>{
                    if(isSignUp){
                        confirmPasswordRef.current.focus()
                    } else{
                        onSubmit();
                    }
                }}
            />
            {isSignUp && (
                <BorderedInput 
                    placeholder='비밀번호 확인' 
                    hasMarginBottom onPress={onSubmit} 
                    onChangeText={createChangeTextHandler('confirmPassword')} 
                    secureTextEntry 
                    ref={confirmPasswordRef}
                    onSubmitEditing={onSubmit}
                />
            )}
        </>
    )
}

export default SignInForm
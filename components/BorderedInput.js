import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const BorderedInput = ({ hasMarginBottom, ...rest }, ref) => {
    return (
        <TextInput
            style={[styles.input, hasMarginBottom && styles.margin]}
            ref={ref}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    input: {
      borderColor: '#bdbdbd',
      borderWidth: 1,
      paddingHorizontal: 16,
      borderRadius: 4,
      height: 48,
      backgroundColor: 'white',
    },
    margin: {
      marginBottom: 16,
    },
});

export default React.forwardRef(BorderedInput)
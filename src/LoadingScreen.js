import React from 'react'
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import * as firebase from 'firebase';

export default class LoadingScreen extends React.Component{
    async componentDidMount(){
        firebase.auth().onAuthStateChanged(user =>{
            this.props.navigation.navigate(user ? "App": "Auth")
        })
    }
    
    render(){
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color="black"></ActivityIndicator>
                <Text>   Carregando...</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
})
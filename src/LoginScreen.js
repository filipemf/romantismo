import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert} from 'react-native'
import * as firebase from 'firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Updates from 'expo-updates';

export default class LoginScreen extends React.Component{
    static navigationOptions = {
        headerShown: false
    }

    state ={
        email: "",
        password: "",
        errorMessage: null,
        secureTextEntry: true,
        loading: false
    }


    AsyncErrorAlert = async (error) => new Promise((resolve) => {
        Alert.alert(
          'Ops, algo deu errado!',
          String(error),
          [
            {
              text: 'ok',
              onPress: () => {
                resolve('YES');
              },
            },
          ],
          { cancelable: false },
        );
      });

    AsyncAlert = async () => new Promise((resolve) => {
        Alert.alert(
            'Atualização',
            'Aoba! Parece que há atualizações disponiveis. Me da um minuto que eu vou baixar tudo.',
            [
            {
                text: 'ok',
                onPress: () => {
                resolve('YES');
            },
            },
            ],
            { cancelable: false },
            );
    });

    async componentDidMount(){
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                // ... notify user of update ...
                await this.AsyncAlert()
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
          } catch (e) {
            // handle or log error
            await this.AsyncErrorAlert(e)
          }
    }

    handleLogin = async () => {
        const {email, password} = this.state

        //set login screen on
        await this.setState({loading: true},async()=>{
            //Use firebase intern method to sign in
            await firebase.auth().signInWithEmailAndPassword(email, password).catch(error => this.setState({errorMessage: error.message}))
            await this.setState({loading: false})
        })
    }

    onIconPress = ()=>{
        this.setState({secureTextEntry: !this.state.secureTextEntry})
    }
    
    render(){
        if(this.state.loading==false){
        return(
            <ScrollView style={styles.container}>
                <Text style={[styles.greetings, {fontSize: 14, fontFamily: 'Helvetica-Nue-Condensed'}]}>Vamos lá, turma...</Text>

                <Text style={[styles.greetings, {fontFamily: 'Palatino-Linotype', fontSize: 42, bottom: 40}]}>
                    Romantismo
                </Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.errorLog}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View style={{}}>
                        <Text style={styles.inputTitle}>Email</Text>

                        <View style={{borderBottomWidth: 1}}>
                            <TextInput 
                                style={styles.input}
                                autoCapitalize="none" 
                                onChangeText={email => this.setState({email})}
                                value={this.state.email}>
                            </TextInput>
                        </View>
                        
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Senha</Text>

                        <TouchableOpacity style={{left: '90%', top: 12, left:270}} onPress={this.onIconPress}>
                            <MaterialCommunityIcons size={28} name="eye"/>
                        </TouchableOpacity>

                        <View style={{borderBottomWidth: 1}}>
                            <TextInput 
                                style={styles.input} 
                                secureTextEntry={this.state.secureTextEntry} 
                                autoCapitalize="none"
                                onChangeText={password => this.setState({password})}
                                value={this.state.password}>
                            </TextInput>
                        </View>
                        
                        
                    </View>
                </View>

                <TouchableOpacity style={[styles.button,{backgroundColor:'#6fa691'}]} onPress={this.handleLogin}>
                    <Text style={{color: '#fff', fontWeight: '500', fontFamily: 'Helvetica-Nue-Bold'}}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: 'center', marginTop: 32}} onPress={()=> this.props.navigation.navigate("Register")}>
                    <Text style={{color: '#414959', fontSize: 16, fontFamily: 'Helvetica-Nue'}}>
                        Novo por aqui? <Text style={{fontWeight: '500', color: '#E9446A', fontFamily: 'Helvetica-Nue'}}>Se cadastre</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: 'center', marginTop: 32}} onPress={()=> alert("To trabalhando nisso ainda. \nPor enquanto vem de zap que eu resolvo.")}>
                    <Text style={{color: '#414959', fontSize: 16, fontFamily: 'Helvetica-Nue'}}>
                        Esqueceu sua senha?
                    </Text>
                </TouchableOpacity>

                <View style={{marginBottom: 50}}></View>

            </ScrollView>
        )
        }
        else{
            return(
                <View style={{flex:1, alignSelf:'center', alignContent:'center', alignItems:'center', flexDirection:'row'}}>
                    <ActivityIndicator color="black" size="large"/>
                    <Text style={{fontFamily: 'Helvetica-Nue-Condensed'}}>    Entrando...</Text>

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'

    },
    greetings:{
        marginTop: 72,
        fontSize: 18,
        fontWeight: '200',
        textAlign: 'center'
    },
    errorMessage:{
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        bottom: 35,
        fontSize: 22
    },
    form: {
        alignSelf: 'center',
        width: '90%',
        //backgroundColor: '#ffffff',
        top: '-5%',
        paddingBottom: 20,
        fontSize: 32
    },
    inputTitle:{
        color: '#000',
        fontSize: 16,
        fontFamily: 'Helvetica-Nue-Bold'
    },
    input: {
        borderBottomColor: 'black', //#8A89FE
        height: 60,
        fontSize: 18,
        color: '#161F3D',
        height: 70,
        left: 30,
        fontFamily: 'Helvetica-Nue'
        
    },
    errorLog:{
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },
    button: {
        marginHorizontal: 50,
        backgroundColor: 'coral',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
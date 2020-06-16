import React from 'react'
import {StatusBar, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Picker} from 'react-native'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import Fire from '../Fire'

export default class RegisterScreen extends React.Component{
    static navigationOptions = {
        headerShown: false
    }

    state ={
        user: {
            name: "",
            email: "",
            password: "",
            username: "",
            turma: "3°ETIM B"
            
        },
        secureTextEntry: false,
        loading: false,
        errorMessage: null
    }

    onIconPress = ()=>{
      this.setState({secureTextEntry: !this.state.secureTextEntry})
    }
    componentDidMount(){
      this.onIconPress()
    }

    handleSignUp = () => {
      //Checking username variable to have control over sign ups
      if(this.state.user.username=="dalvana"||this.state.user.username=="riccardo"||this.state.user.username=="Dalvana"||this.state.user.username=="Riccardo"){
          if(this.state.user.name!=""){
            this.setState({loading: true}, async()=>{
              //access create user from firebase function
              await Fire.shared.createUser(this.state.user).catch(error => this.setState({errorMessage: error.message}))
              this.setState({loading: false})
            })
          }
          else{
            alert("Por favor, insira todas as informações.")
          }
      }
      else{
        alert("A palavra secreta está incorreta. Desculpe.")
      } 
    }
    
    render() {
      if(this.state.loading==false){
        return (
          <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate('Login')}>
              <Ionicons name='ios-arrow-round-back' size={32} color='#FFF'/>
            </TouchableOpacity>

            <View style={{ position: 'absolute', top: 64, alignItems: 'center', width: '100%'}}>
                  <Text style={styles.greeting}>Registre-se para começar.</Text>
            </View>
        
            <View style={styles.errorMessage}>
                {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
            </View>
        
            <View style={styles.form}>
              <View>
                <Text style={styles.inputTitle}>Nome completo</Text>
                  <TextInput style={styles.input} 
                    placeholder="Este será o nome que aparecerá na tela"
                    onChangeText={name =>
                    this.setState({ user: { ...this.state.user, name } })
                    }
                    value={this.state.user.name}>    
                  </TextInput>
              </View>

              <View style={{marginTop:22, flexDirection: 'row'}}>

                <Text style={{fontFamily: 'Helvetica-Nue', fontSize: 17}}>Turma: </Text>    
                <Picker selectedValue={this.state.user.turma} style={{ width: 150, fontFamily: 'Helvetica-Nue', fontSize: 22, bottom: 17 }} onValueChange={(itemValue, itemIndex) => this.setState({user: { ...this.state.user, turma: itemValue }})}>
                  <Picker.Item label="3°ETIM B" value="3°ETIM B"/>
                  <Picker.Item label="Turma 2" value="eX1eWKxK7S2l9aEcXimD" />
                </Picker>

              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.inputTitle}>Email</Text>
                <TextInput style={styles.input} autoCapitalize='none'
                  placeholder="Ex: aaaaa@aaaa.com"
                  onChangeText={email =>
                    this.setState({ user: { ...this.state.user, email } })
                  }
                  value={this.state.user.email}>
                </TextInput>
              </View>

              <View style={{ marginTop: 22 }}>
                <Text style={styles.inputTitle}>Palavra secreta</Text>
                <TextInput style={styles.input} autoCapitalize='words'
                  onChangeText={username =>
                    this.setState({ user: { ...this.state.user, username } })
                  }
                  value={this.state.user.username}
                  placeholder="Cite um, dentre os MAIS VÁRZEA">
                </TextInput>
              </View>
        
              <View style={{ marginTop: 12 }}>
                <TouchableOpacity style={{left: '90%', top: 10}} onPress={this.onIconPress}>
                  <MaterialCommunityIcons size={25} name="eye"/>
                </TouchableOpacity>

                <Text style={styles.inputTitle}>Senha</Text>
                <TextInput style={styles.input} autoCapitalize='none' secureTextEntry={this.state.secureTextEntry}
                  onChangeText={password =>
                    this.setState({ user: { ...this.state.user, password } })
                  }
                  value={this.state.user.password}>
                </TextInput>
              </View>
            </View>
        
            <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
              <Text style={{ color: '#fff', fontWeight: '500' }}>Cadastrar</Text>
            </TouchableOpacity>
                      
            <View style={{marginBottom: 150}}></View>
              
          </ScrollView>
        );
      }
      else{
        return(
          <View style={{flex:1, alignSelf:'center', alignContent:'center', alignItems:'center', flexDirection:'row'}}>
            <ActivityIndicator size="large" color="black"/>
              <Text style={{fontFamily: 'Helvetica-Nue-Condensed'}}>    Fazendo cadastro...</Text>
          </View>
        )
      }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    greeting: {
      marginTop: 22,
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
      color: '#000',
      fontFamily:'Helvetica-Nue-Condensed'
    },
    form: {
      marginBottom: 28,
      marginHorizontal: 30,
      top: 120
    },
    inputTitle: {
      color: '#000',
      fontSize: 16,
      fontFamily: 'Helvetica-Nue',
    },
    input: {
      borderBottomColor: '#8a8f9e',
      borderBottomWidth: StyleSheet.hairlineWidth,
      height: 40,
      fontSize: 15,
      color: '#161f3d',
      fontFamily: 'Helvetica-Nue',
    },
    errorMessage: {
      top: 115,
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 90
    },
    button: {
      marginHorizontal: 30,
      backgroundColor: '#E9446a',
      borderRadius: 4,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      top: 100
    },
    error: {
      color: '#e9446a',
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center'
    },
    back: {
      position: 'absolute',
      top: 48,
      left: 32,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(21, 22, 48, 0.1)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      backgroundColor: '#e1e2e6',
      borderRadius: 50,
      marginTop: 48,
      justifyContent: 'center',
      alignItems: 'center'
    },
    avatar: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50
    }
  });
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import 'react-native-gesture-handler'

import LoadingScreen from './src/LoadingScreen'
import RegisterScreen from './src/RegisterScreen'
import LoginScreen from './src/LoginScreen'

import * as Font from 'expo-font'

Font.loadAsync({
  'Helvetica-Nue-Condensed': require('./assets/fonts/helvetica-neue-67-medium-condensed.otf'),
  'Helvetica-Nue': require('./assets/fonts/helvetica-neue.ttf'),
  'Metropolis-Regular': require('./assets/fonts/Metropolis-Regular.otf'),
  'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
  'Helvetica-Nue-Black': require('./assets/fonts/helvetica-neue-condensed-black.ttf'),
  'Helvetica-Nue-Bold': require('./assets/fonts/helvetica-neue-bold.ttf'),
  'Palatino-Linotype': require('./assets/fonts/palatino-linotype.ttf')
}); 

import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

import Main from './src/main'

console.disableYellowBox = true; 

const AppContainer = createStackNavigator({
  Main:{
    screen: Main
  },

},
{
  mode: "modal",
  headerMode: "none",
  cardStyle:{
    backgroundColor:"transparent",
    opacity:0.99
  }  
})


const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
},
{
  initialRouteName: "Login",
  navigationOptions: {
    header: null
  }
})

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      Auth: AuthStack,
      App: AppContainer
    },
    {
      defaultNavigationOptions: {
        header: null
      },
      initialRouteName: 'Loading'
    }
  )
)
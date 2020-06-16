import React from 'react'
import {View, Text, FlatList, Button, Dimensions, Platform, ActivityIndicator, Alert, TouchableOpacity, ScrollView} from 'react-native'

import ToDoList from '../src/components/ToDoList'
import Fire from '../Fire'
import {CheckBox} from 'react-native-elements'

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import * as Updates from 'expo-updates';

export default class Main extends React.Component{
  state = {
    addTodoVisible: false,
    user: {},
    lists: [],
    loading: true,
    name: "",

    exatas: true,
    humanas: true,
    biologicas: true,
    tecnico: true,
    expoToken: '',
    isFetching: false

  };

  onRefresh = async () => {
    this.setState({ isFetching: true }, async () => {
      await Fire.shared.getUserList(lists => {
        this.setState({ lists }, async () => {
          this.setState({ isFetching: false })
        })
      })
    })

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

  AsyncLogOutAlert = async () => new Promise((resolve) => {
    Alert.alert(
      '',
      'Deseja sair?',
      [
        {
          text: 'Não',
          onPress: () => {
            resolve('No');
          },
        },
        {
          text: 'Sim',
          onPress: () => {
            Fire.shared.signOut();
          },
        },
      ],
      { cancelable: false },
    );
  });



  async componentDidMount() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await this.AsyncAlert()
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...

        await Updates.reloadAsync();
      }
    } catch (e) {
      // handle or log error
      await this.AsyncErrorAlert(e)
    }

    await this.registerForPushNotificationsAsync()
    await Notifications.cancelAllScheduledNotificationsAsync()

    console.disableYellowBox = true;

    await Fire.shared.getUserList(lists => {
      this.setState({ lists }, async () => {
        await this.setState({ name: await Fire.shared.getUsername() })
        this.setState({ loading: false })
      })
    })
  }

  registerForPushNotificationsAsync = async () => {
    //Register device's id to send notifications. Available on expo docs
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      await Fire.shared.registerForNotifications(token)

      this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
      });
    }
  };

  componentWillUnmount() {
    //Stop database from listening
    Fire.shared.detach()
  }

  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible })
  }

  renderList = (list) => {
    return <ToDoList list={list} expoToken={this.state.expoToken} updateList={this.updateList} exatas={this.state.exatas} humanas={this.state.humanas} biologicas={this.state.biologicas} tecnico={this.state.tecnico} />
  }

  addList = async list => {
    await Fire.shared.addList({
      name: list.name,
      timestamp: Fire.shared.timestamp,
      color: list.color,
      todos: []
    })
  }

  updateList = async list => {
    await Fire.shared.updateList(list)
  }

  render() {
    if (this.state.loading == true) {
      return (
        <View style={{ flex: 1, alignSelf: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <ActivityIndicator color="black" size="large" />
          <Text style={{ fontFamily: 'Helvetica-Nue-Condensed' }}>    Vai devagar, sem correr no pátio!</Text>
        </View>
      )
    }
    else {
      return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <Text>{"\n\n"}</Text>

          <View style={{ flexDirection: 'row', marginBottom: 15, width: ((Dimensions.get('window').width * 60) / 100), alignSelf: 'flex-start' }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={async () => await this.AsyncLogOutAlert()}>
              <Text style={{ left: 40, fontSize: 23, fontFamily: 'Helvetica-Nue-Condensed' }}>Olá, </Text>
              <Text style={{ left: 40, fontSize: 23, fontFamily: 'Helvetica-Nue' }}>{this.state.name}</Text>
            </TouchableOpacity>
          </View>


          <View style={{ flexDirection: 'row', alignSelf: 'center', bottom: 10, left: 0, margin: 10 }}>
            <View>
              <Button title="Atualizar" onPress={() => { this.setState({ isFetching: !this.state.isFetching }) }} />
            </View>
          </View>

          <TouchableOpacity style={{ borderWidth: 2, borderRadius: 4, width: 80, height: 40, alignSelf: 'center', marginBottom: 3 }} onPress={() => { this.forceUpdate() }}>
            <Text style={{ alignSelf: 'center', textAlignVertical: 'center', textAlign: 'justify' }}>+</Text>
          </TouchableOpacity>

          <ScrollView horizontal={true} style={{ margin: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
              <CheckBox
                center
                title='Exatas'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.exatas}
                onPress={() => this.setState({ exatas: !this.state.exatas })}
              />
              <CheckBox
                center
                title='Humanas'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.humanas}
                onPress={() => this.setState({ humanas: !this.state.humanas })}
              />
              <CheckBox
                center
                title='Biologicas'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.biologicas}
                onPress={() => this.setState({ biologicas: !this.state.biologicas })}
              />
              <CheckBox
                center
                title='Técnico'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.tecnico}
                onPress={() => this.setState({ tecnico: !this.state.tecnico })}
              />
            </View>
          </ScrollView>

          <View style={{ borderBottomColor: 'black', borderBottomWidth: 4 }}></View>

          <FlatList
            style={{ width: "1000%", right: 14, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            numColumns={2}
            extraData={this.state}
            //Working on progress
            onRefresh={() => this.onRefresh()}
            refreshing={true}

            data={this.state.lists}
            keyExtractor={item => item.id.toString()}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always" />
        </View>
      )
    }
  }
}

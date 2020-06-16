import * as firebase from 'firebase'

//IMPORTANT: IMPORT YOUR OWN KEYS
import FirebaseKeys from './config'

require('firebase/firestore');

class Fire {
  constructor() {
    // Initialize Firebase
    firebase.initializeApp(FirebaseKeys);
    //firebase.analytics();
    firebase.database.enableLogging(true);
  }

  createUser = async user => {
    try {
      //create a user using firebase internal method
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

      //Create a register in firebase database with general user informations
      let db = this.firestore.collection("users").doc(this.uid)
      db.set({
        name: user.name,
        turma: user.turma,
        uid: this.uid
      })
    }
    catch (e) {
      throw e;
    }
  }

  registerForNotifications = async(token)=>{
    //Register the notification token to database
    try {
      await this.firestore.collection("tokens").doc(this.uid).set({
        uid: this.uid,
        token: token
      })
    } catch (error) {
      alert(error)
    }
    
  }

  getUserList = async (callback) => {
    const turma = await this.getTurma() //get 'turma' reference to redirect to a specific list

    //Set a listener for lists changes and resolve a callback with lists data
    this.unsubscribe = this.firestore.collection('lists').doc(turma).collection('userLists').orderBy('name').onSnapshot(snapshot => {
      lists = []
      snapshot.forEach(async doc => {
        lists.push({ id: doc.id, ...doc.data() })
      })
      callback(lists)
    })
  }

  addList = async (list) => {
    const turma = await this.getTurma()
    this.firestore.collection('lists').doc(turma).collection('userLists').add(list)
  }

  //Get user name for display reasons
  getUsername=async()=>{
    let name = await this.firestore
      .collection("users")
      .doc(this.uid)
      .get()
    return name.data().name
  }

  //Update lists data
  updateList = async (list) => {
    const turma = await this.getTurma()
    this.firestore.collection('lists').doc(turma).collection('userLists').doc(list.id).update(list)
  }

  //Under working
  insertNewList = async (list) => {
    try {
      const checkList = await this.firestore.collection('lists').doc(this.uid).get()
      console.log(list)
      if (checkList && checkList.exists) {
        await this.firestore.collection('lists').doc(this.uid).collection('userLists').update({
          name: list.name,
          color: list.color,
          timestamp: this.timestamp,
          todos: []
        }).then(() => console.log("updatado"))
      } else {
        console.log(list.name, list.color)
        await this.firestore.collection('lists').doc(this.uid).collection('userLists').add({
          name: list.name,
          color: list.color,
          timestamp: this.timestamp
        }).then(() => console.log('criado com sucesso'))
      }
    } catch (error) {
      console.log(error)
    }

  }

  detach() {
    //Stop listening
    this.unsubscribe()
  }

  signOut = () => {
    firebase.auth().signOut()
  }

  //Get turma references to be used on another methods
  getTurma = async () => {
    const data = await this.firestore.collection('users').doc(this.uid).get()
    let turma = await data.data().turma
    console.log(turma)
    return turma
  }

  getRef = async () => {
    const turma = await this.getTurma()
    return this.firestore.collection('lists').doc(turma).collection('userLists')
  }

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
}
      
Fire.shared = new Fire();
export default Fire;
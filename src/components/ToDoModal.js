import React from 'react'
import {StatusBar, FlatList, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Keyboard, Animated, Button, Dimensions, ActivityIndicator} from 'react-native'
import {AntDesign, Ionicons, Entypo}  from '@expo/vector-icons'
import Colors from '../utils/Colors'
import {Swipeable} from 'react-native-gesture-handler'
import DatePicker from "react-native-modal-datetime-picker";

import LottieView from 'lottie-react-native';

export default class ToDoModal extends React.Component{
    state = {
        newTodo: "",
        date: "",
        isDatePickerVisible: false,
        progress: new Animated.Value(0),
        loading: false
    }

    async componentWillMount(){
        await Font.loadAsync({
            'Helvetica-Nue-Condensed': require('../../assets/fonts/helvetica-neue-67-medium-condensed.otf'),
            'Helvetica-Nue-Bold': require('../../assets/fonts/helvetica-neue-bold.ttf')
        })
    }

    showDatePicker = async () => {
        this.setState({isDatePickerVisible: true});
      };
    
    hideDatePicker = async () => {
       this.setState({isDatePickerVisible: false});
    };

    async componentDidMount(){
        this.animation.play(1, 130)
    }

    handleConfirm = async (date) => {
        let today = new Date()
        let myTimestamp = date.getTime()

        this.setState({date: myTimestamp}, async ()=> {
            this.hideDatePicker();
        })
        
    };

    toggleTodoCompleted = index=>{
        //Toggle todo based on it's state
        let list = this.props.list
        list.todos[index].completed = !list.todos[index].completed
        //await Fire.shared.updateTodo(list)
        this.props.updateList(list)
    }
        
    addTodo=async ()=>{
        let list = this.props.list

        //Only add a todo if the text and the date isnt null. "updateList" will trigger a function on "main.js" and add to firebase database
        if(this.state.newTodo!=""&&this.state.date!=""){
            if(!list.todos.some(todo => todo.title === this.state.newTodo)){
                await list.todos.push({title: this.state.newTodo, completed: false, date: this.state.date})
                this.props.updateList(list)
            }
            this.setState({newTodo: ""}, async()=>{
                this.setState({date: ""})
            })
            Keyboard.dismiss()
        }  
    }

    deleteTodo = index=>{
        let list = this.props.list

        //Delete todo based on index
        list.todos.splice(index, 1)

        //Activate updateList from "main.js"
        this.props.updateList(list)
    }

    rightActions = (dragX, index)=>{
        //Only working on IOS. Modal+Android are not working yet
        try{
            const scale =  dragX.interpolate({
                inputRange: [-100, 0],
                outputRange: [1,0.9],
                extrapolate: 'clamp'
            })
            
            return (
                <TouchableOpacity onPress={()=> this.deleteTodo(index)}>
                    <View style={styles.deleteButton}>
                        <Animated.Text style={{color: Colors.white, fontWeight: 'bold', transform: [{scale}]}}>Deletar</Animated.Text>
                    </View>
                </TouchableOpacity>
            )
        }
        catch(e){
            alert(e)
        }
        
    }

    renderToDo = (todo, index)=>{
        //WARNING: React Native Gestures+Swipeable are only working on IOS. Gestures on modal are not supported/working on Android (until yet)

        let day = new Date(todo.date).getDate()
        let month = new Date(todo.date).getMonth()
        let year = new Date(todo.date).getFullYear()

        let fullDate = String(day)+"/"+String(Number(month)+1)+"/"+String(year)

        return(
            <Swipeable renderRightActions={(_, dragX)=>this.rightActions(dragX, index)}>
                <View style={styles.todoContainer}>

                    <TouchableOpacity onPress={()=> this.deleteTodo(index)}>
                        <AntDesign
                            name={"delete"}
                            size={16} 
                            color={Colors.red} 
                            style={{width: 32}}/>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={()=> this.toggleTodoCompleted(index)}>
                        <Ionicons 
                            name={todo.completed ? "ios-square":"ios-square-outline"}
                            size={24} 
                            color={Colors.lightGrey} 
                            style={{width: 32}}/>
                    </TouchableOpacity>

                    <View style={{right:10}}>
                        <Text style={[styles.todo, {right:-5, top: 7, textDecorationLine: todo.completed? 'line-through': 'none' ,color: todo.completed?Colors.grey: "#000"}]}>{todo.title}</Text>
                        <Text style={{top: 18,color: todo.completed?"#56d636":"#2c4a8f", fontSize: 13, fontFamily: 'Helvetica-Nue-Bold', right:25}}>{todo.completed?<Text>ENTREGUE</Text>:<Text>ENTREGAR EM:</Text>}  {todo.completed?<Text></Text>:<Text>{fullDate}</Text>}</Text>
                    </View>
                      
                    
                </View>
            </Swipeable>
        )  
    }

    
    render(){
        const list = this.props.list
        const taskCount = list.todos.length
        const completedCount = list.todos.filter(todo => todo.completed).length

        let day = new Date(this.state.date).getDate()
        let month = new Date(this.state.date).getMonth()
        let year = new Date(this.state.date).getFullYear()

        let fullDate = String(day)+"/"+String(Number(month)+1)+"/"+String(year)

        if(this.state.loading==true){
            return(
                <View style={{flex: 1, margin: 10}}>
                    <ActivityIndicator size="large" color="black"/>
                </View>
            )
        }
        else{
            return(
                <KeyboardAvoidingView behavior="height" enabled style={[styles.borderModal, { flex:1, marginLeft:10, marginRight:10, bottom:70, marginTop: 110, borderBottomEndRadius: 5, borderBottomStartRadius: 5 ,marginBottom: 0, backgroundColor: 'rgba(252, 255, 255, 1.0)'}]}>
                        
                    <TouchableOpacity style={{position: 'absolute', top: 64, right: 32, zIndex: 10, top: 25}} onPress={this.props.closeModal}>
                        <AntDesign name="close" size={24} color={"#000"}/>
                    </TouchableOpacity>
                    
                    <View style={[styles.header, {borderBottomWidth: 1, top: 0, width: '100%', backgroundColor: "#f0f0f0", }]}>
                        <View style={{flexDirection: 'row', left: 0}}>
                            {
                            (list.name=="GEO"||list.name=="FILO"||list.name=="SOCIO"||list.name=="PORT"||list.name=="INGLES"||list.name=="HIST")?
                                <LottieView
                                    style={{width: 98, height: 117, right: -10, bottom: -1}}
                                    speed={1}
                                    autoPlay
                                    source={require('../../assets/Animations/3154-books-2.json')}
                                    ref={animation => {
                                        this.animation = animation;
                                    }}
                                />:
                            (list.name=="BIO"||list.name=="ED.FISICA")?
                                <LottieView
                                    style={{width: 100, height: 100, right: -10, bottom: 10}}
                                    speed={1}
                                    autoPlay
                                    source={require('../../assets/Animations/4659-avocad-bros.json')}
                                    ref={animation => {
                                        this.animation = animation;
                                    }}
                                />:
                            (list.name=="DS"||list.name=="PC"||list.name=="REDES"||list.name=="T.MOBILE"||list.name=="TCC")?
                                <LottieView
                                    style={{width: 97, height: 98, right: -10, bottom: -8}}
                                    speed={1}
                                    autoPlay
                                    source={require('../../assets/Animations/6602-happy-computer.json')}
                                    ref={animation => {
                                        this.animation = animation;
                                    }}
                                />:
                                <LottieView
                                    style={{width: 97, height: 98, right: -10, bottom: -8}}
                                    speed={1}
                                    autoPlay
                                    source={require('../../assets/Animations/4851-calculating.json')}
                                    ref={animation => {
                                        this.animation = animation;
                                    }}
                                />
                            }
                            {list.name=="BIO"||list.name=="ED.FISICA"?
                                <View style={{top: 25}}>
                                    <Text style={[styles.title, {left: 48}]}>{list.name}</Text>
                                    <Text style={[styles.taskCount,{left: 48}]}>{completedCount} de {taskCount} completadas</Text>
                                </View>
                                :
                                <View style={{top: '14%'}}>
                                    <Text style={[styles.title, {left: 48}]}>{list.name}</Text>
                                    <Text style={[styles.taskCount,{left: 48}]}>{completedCount} de {taskCount} completadas</Text>
                                </View>
                            } 
                        </View>
                    </View>
                        
                    <View style={[styles.section, {flex: 3, marginVertical: 16, right: 15}]}>
                        <FlatList data={list.todos} 
                            renderItem={({item, index})=> this.renderToDo(item, index)} 
                            keyExtractor={item => item.title}            
                            showsVerticalScrollIndicator={false}/>
                    </View>

                    <View style={[styles.section, styles.footer]}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput style={[styles.input, {borderColor: list.color, color: "#000",paddingVertical: 0}]} onChangeText={text=>this.setState({newTodo: text})} value={this.state.newTodo}/>
                                
                                <TouchableOpacity style={[styles.addTodo, {backgroundColor: list.color}]} onPress={()=> this.addTodo()}>
                                    <AntDesign name="plus" size={16} color={Colors.white}/>
                                </TouchableOpacity>
                        </View>
                                
                        <View style={{flexDirection: 'column', marginTop: 10}}>
                            <View style={{flexGrow: 0, right: 60, flexDirection: 'row'}}>
                                <TouchableOpacity style={{right: 20}} title="Data de entrega:" onPress={this.showDatePicker}>
                                    <Entypo name="calendar" size={28}/>
                                </TouchableOpacity>
                                <DatePicker
                                    isVisible={this.state.isDatePickerVisible}
                                    mode="date"
                                    onConfirm={this.handleConfirm}
                                    onCancel={this.hideDatePicker}/>
                                
                                <Text style={{color: "#000", position: 'absolute', bottom: 5, left: 40, fontSize: 18, fontFamily: 'Helvetica-Nue-Bold'}}>{this.state.date!=""?String(fullDate):<Text>Escolha uma data</Text>}</Text>
                            </View>
                        </View>     
                    </View>
                </KeyboardAvoidingView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    borderModal:{
        borderWidth: 1.5
    },
    section: {
        alignSelf: 'stretch'
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 0,
        paddingTop: 0,
        paddingBottom: 20,
        flex:1
    },
    title: {
        alignSelf: 'center',
        fontSize: 30,
        color: "#000",
        fontFamily: 'Helvetica-Nue-Condensed',

    },
    taskCount: {
        alignSelf: 'center',
        marginTop: 4,
        marginBottom: 16,
        color: Colors.grey,
        fontWeight: 'bold'
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 18
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: 1.5,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
        fontFamily: 'Helvetica-Nue'
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: 'row',
        paddingLeft: 32,
        alignItems: 'center',

        width: ( (Dimensions.get('window').width*70)/100),
    },
    todo: {
        color: Colors.black,
        fontWeight: 'bold',
        fontSize: 16
    },
    deleteButton:{
        flex: 1,
        backgroundColor: Colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80
    }
})
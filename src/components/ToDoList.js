import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, ActivityIndicator} from 'react-native'
import Colors from '../utils/Colors'
import ToDoModal from '../components/ToDoModal'
import { Notifications } from 'expo';
export default class ToDoList extends React.Component{
    state = {
        showListVisible: false,
        nextActivityDay: "",
        list: this.props.list,
        expoPushToken: this.props.expoToken,
        loading: false
    };

    async toggleListModal(){
        this.setState({loading: true}, async()=>{
            this.setState({showListVisible: !this.state.showListVisible}, async ()=>{
                this.setState({nextActivityDay: await this.getRecentDate(this.props.list)}, async()=>{
                    
                    let actualTime =  new Date()
                    let theDay = actualTime.getDate() //NOT UTC (at least for Brazil)
                    let theMonth = actualTime.getMonth()
                    let theYear = actualTime.getFullYear()
                    let timeThatIWantForTest = new Date(theYear, theMonth, theDay+1)
            
                    const verificationForTomorrow = await this.splitDate(timeThatIWantForTest)

                    console.log("no STATE: "+this.state.nextActivityDay+"        "+verificationForTomorrow)
                    if(this.state.nextActivityDay==verificationForTomorrow){
                        //console.log("é pra amanha")
                        await this.addMoreNotifications()
                    }
                    if(this.state.nextActivityDay=="ATIVIDADE PARA HOJE"){
                        await this.addMoreNotifications()
                    }
                    if(this.state.nextActivityDay=="ATIVIDADE ATRASADA"){
                        await this.addMoreNotifications()
                    }
                    this.setState({loading: false})
        })

            })
        })
    }

    async componentDidMount(){
        let actualTime =  new Date()
        let theDay = actualTime.getDate() //NOT UTC (at least for Brazil)
        let theMonth = actualTime.getMonth()
        let theYear = actualTime.getFullYear()
        let timeThatIWantForTest = new Date(theYear, theMonth, theDay+1)

        const verificationForTomorrow = await this.splitDate(timeThatIWantForTest)


        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('bom-dia', {
                priority: 'high',
                name: 'Bom dia!!',
                sound: true,
                vibrate: true,
                badge: true
            });
          }

        await Notifications.cancelAllScheduledNotificationsAsync()

        
        
        this.setState({loading: true}, async()=>{
            await this.setState({nextActivityDay: await this.getRecentDate(this.props.list)}, async()=>{

                //Verify if the activity is for tomorrow. If yes, then schedule a notification for that activity
                if(this.state.nextActivityDay==verificationForTomorrow){
                    await this.handleNotification()
                }
                if(this.state.nextActivityDay=="ATIVIDADE PARA HOJE"){
                    await this.handleNotification()
                }
                if(this.state.nextActivityDay=="ATIVIDADE ATRASADA"){
                    await this.handleNotification()
                }
                this.setState({loading: false})  
            })
        })
        
    }

    addMoreNotifications = async()=>{
        const notification = {
            title: 'Bom dia!',
            body: 'Você não tem nenhuma atividade programada para hoje.',
            badge: 1,
            android: { 
                channelId: "bom-dia",
                icon: '../../assets/notification.png',
                color: '#c51e63'
            }, 
            ios: { sound: true }, // Make a sound on iOS
        }
        const options = {
            time: new Date(), // Schedule it in 10 seconds
            //repeat: 'day', // Repeat it daily
        };


        //Get today date and add +1 to send notification to tomorrow
        let actualTime = options.time
        let theDay = actualTime.getDate() //NOT UTC (at least for Brazil)
        let theMonth = actualTime.getMonth()
        let theYear = actualTime.getFullYear()

        let hour = actualTime.getHours()

        //let timeThatIWantForTest = new Date(theYear, theMonth, theDay, 19, 48);

        //let timeThatIWantForTest = new Date(theYear, theMonth, hour > 20 ?theDay+1: theDay, 20, 17)

        let timeThatIWantForTest

        if(hour>8){
           timeThatIWantForTest = new Date(theYear, theMonth, hour > 8 ?theDay+1: theDay, 8);


           const verificationForTomorrow = await this.splitDate(timeThatIWantForTest)

            //pass the date to the options object
            options.time = timeThatIWantForTest

            const dayResult = this.state.nextActivityDay

           console.log(this.state.list.name+" :"+dayResult+"    "+verificationForTomorrow)
           if(dayResult==verificationForTomorrow){
                console.log("Atividade de "+this.state.list.name+" programada para hoje! "+verificationForTomorrow)
                notification.body = "Atividade de "+this.state.list.name+" programada para hoje! "+verificationForTomorrow


                return await Notifications.scheduleLocalNotificationAsync(notification, options) //Finally, schedule all notificatino
            }
        }else{
            timeThatIWantForTest = new Date(theYear, theMonth, theDay, 8);
            //Variable just for testing the notifications on the same day
            //console.log(timeThatIWantForTest)

            //Format to dd/mm/yy
            const verificationForTomorrow = await this.splitDate(timeThatIWantForTest)

            //pass the date to the options object
            options.time = timeThatIWantForTest

            const dayResult = this.state.nextActivityDay

            if(dayResult=="ATIVIDADE PARA HOJE"){
                console.log("Atividade de "+this.state.list.name+" programada para HOJE! "+verificationForTomorrow)
                notification.body = "Atividade de "+this.state.list.name+" programada para hoje! "+verificationForTomorrow

                return await Notifications.scheduleLocalNotificationAsync(notification, options) //Finally, schedule all notificatino
            }
            if(dayResult=="ATIVIDADE ATRASADA"){
                console.log("Um atividade de "+this.state.list.name+" está atrasada! Venha ver. ")
                notification.body = "Um atividade de "+this.state.list.name+" está atrasada! Venha ver."

                return await Notifications.scheduleLocalNotificationAsync(notification, options) //Finally, schedule all notificatino
            }
        }


    }

    handleNotification = async ()=>{
        //Cancel all previously notifications to not send duplicates
        await Notifications.cancelAllScheduledNotificationsAsync()

        const notification = {
            title: 'Bom dia!',
            body: 'Você não tem nenhuma atividade programada para hoje.',
            badge: 1,
            android: { 
                channelId: "bom-dia",
                icon: '../../assets/notification.png',
                color: '#c51e63'
            }, 
            ios: { sound: true }, // Make a sound on iOS
        }
        const options = {
            time: new Date(), // Schedule it in 10 seconds
            //repeat: 'day', // Repeat it daily
        };


        //Get today date and add +1 to send notification to tomorrow
        let actualTime = options.time
        let theDay = actualTime.getDate() //NOT UTC (at least for Brazil)
        let theMonth = actualTime.getMonth()
        let theYear = actualTime.getFullYear()

        let hour = actualTime.getHours()

        //let timeThatIWantForTest = new Date(theYear, theMonth, theDay, 19, 48);

        //let timeThatIWantForTest = new Date(theYear, theMonth, hour > 20 ?theDay+1: theDay, 20, 17)

        let timeThatIWantForTest

        if(hour>8){
           timeThatIWantForTest = new Date(theYear, theMonth, hour > 8 ?theDay+1: theDay, 8);


           const verificationForTomorrow = await this.splitDate(timeThatIWantForTest)

            //pass the date to the options object
            options.time = timeThatIWantForTest

            const dayResult = this.state.nextActivityDay

           if(dayResult==verificationForTomorrow){
                console.log("Atividade de "+this.state.list.name+" programada para hoje! "+verificationForTomorrow)
                notification.body = "Atividade de "+this.state.list.name+" programada para hoje! "+verificationForTomorrow

                await Notifications.cancelAllScheduledNotificationsAsync()

                return await Notifications.scheduleLocalNotificationAsync(notification, options) //Finally, schedule all notificatino
            }
        }else{
            //Variable just for testing the notifications on the same day
            timeThatIWantForTest = new Date(theYear, theMonth, theDay, 8);
            //console.log(timeThatIWantForTest)

            //Format to dd/mm/yy
            const verificationForTomorrow = await this.splitDate(timeThatIWantForTest)

            //pass the date to the options object
            options.time = timeThatIWantForTest

            const dayResult = this.state.nextActivityDay
            

            if(dayResult=="ATIVIDADE PARA HOJE"){
                console.log("Atividade de "+this.state.list.name+" programada para HOJE! "+verificationForTomorrow)
                notification.body = "Atividade de "+this.state.list.name+" programada para hoje! "+verificationForTomorrow

                await Notifications.cancelAllScheduledNotificationsAsync()

                return await Notifications.scheduleLocalNotificationAsync(notification, options) //Finally, schedule all notificatino
            }
            if(dayResult=="ATIVIDADE ATRASADA"){
                console.log("Um atividade de "+this.state.list.name+" está atrasada! Venha ver. ")
                notification.body = "Um atividade de "+this.state.list.name+" está atrasada! Venha ver."

                await Notifications.cancelAllScheduledNotificationsAsync()

                return await Notifications.scheduleLocalNotificationAsync(notification, options) //Finally, schedule all notificatino
            }
        }
         
    }

    getSplittedTodayDate = async()=>{
        //Get date in dd/mm/yy format
        let today = new Date()
        let todayDay = today.getDate()
        let todayMonth = today.getMonth()
        let todayYear =today.getFullYear()

        let todayDate = new Date(todayYear, todayMonth, todayDay);
        let splittedDate = await this.splitDate(todayDate)
    }
        
    getRecentDate = async (list)=>{
        //One of the core functions. I pass a list to it, and it select the earliest activity to be deliverid

        let allTodos = list.todos

        let today = new Date()
        let todayDay = today.getDate()
        let todayMonth = today.getMonth()
        let todayYear =today.getFullYear()

        //Get today date WITHOU hours and minutes (hours and date will be = 00)
        var todayDate = new Date(todayYear, todayMonth, todayDay);


        let arrayOfDates = []

        for (var key of Object.keys(allTodos)) {
            let loopDate = allTodos[key].date

            if(allTodos[key].completed==false){
                arrayOfDates.push(loopDate)
            }   
            
        }
        //The first value to always compare to the next one
        let min = arrayOfDates[0]

        for(let i = 1; i < arrayOfDates.length; i++) {
            if (arrayOfDates[i] < arrayOfDates[0])
              min = arrayOfDates[i]
        }
        
        //format all date
        let date = await this.splitDate(min)
        let date_today = await this.splitDate(todayDate)


        //return the message depending on the day
        return date==date_today?"ATIVIDADE PARA HOJE":min<todayDate?"ATIVIDADE ATRASADA":min>todayDate?date:date
        
    }

    splitDate = async(date)=>{
        //format any date to dd/mm/yy
        let day = new Date(date).getDate()
        let month = new Date(date).getMonth()
        let year = new Date(date).getFullYear()

        let fullDate = String(day)+"/"+String(Number(month)+1)+"/"+String(year)
        return fullDate
    }


    render(){
        const list = this.state.list

        let exatas = this.props.exatas
        let humanas = this.props.humanas
        let biologicas = this.props.biologicas
        let tecnico = this.props.tecnico

        let completedCount = list.todos.filter(todo=> todo.completed).length
        let remainingCount = list.todos.length - completedCount

        
        if(this.state.loading==true){
            return(
                <View style={{flex: 1, margin: 10}}>
                    <ActivityIndicator size="large" color="black"/>
                </View>
            )
        }else{
            if(exatas==true && list.name=="FISICA" || exatas==true && list.name=="MAT"){
                return (
                    <View>
                        <Modal transparent={true} animationType="slide" visible={this.state.showListVisible} onRequestClose={()=> this.toggleListModal()} swipeDirection={'right'} propagateSwipe>
                            <View style={{padding:5, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%'}}>
                                <ToDoModal list={list} closeModal={() => this.toggleListModal()} updateList={this.props.updateList} swipeDirection={'right'} propagate/>
                            </View>
                        </Modal>
                        <View style={{right: -5,flexDirection: 'row', width: ( (Dimensions.get('window').width*50)/100) }}>
                            {
                            <TouchableOpacity style={[styles.listContainer, {backgroundColor: list.color}]} onPress={()=> this.toggleListModal()}>
                                <Text style={styles.listTitle} numberOfLines={1}>
                                    {list.name}
                                </Text>
                
                                    
                                {
                                    this.state.nextActivityDay=="NaN/NaN/NaN"?
                                        <Text style={{fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma atividade{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE PARA HOJE"?
                                        <Text style={{fontSize: 19, textAlign: 'center', color: "#ffe570", fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE ATRASADA"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="Próxima tarefa em: NaN/NaN/NaN"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma Atividade{"\n"}</Text>:
                    
                                        <Text style={{fontSize: 20, textAlign: 'center', color:"#2c4a8f", fontFamily: 'Helvetica-Nue-Condensed'}}>Próxima tarefa em: {String(this.state.nextActivityDay)}{"\n"}</Text>
                                }
                                    
                                <View style={{flexDirection: 'row', bottom: 25}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{completedCount}</Text>
                                        <Text style={styles.subtitle}>Completas</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{remainingCount}</Text>
                                        <Text style={styles.subtitle}>   Faltando</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            }
                
                                
                            </View>
                            
                            
                    </View>
                )
            }
            if(humanas==true && list.name=="HIST" || humanas==true && list.name=="GEO" || humanas==true && list.name=="FILO" || humanas==true && list.name=="SOCIO" || humanas==true && list.name=="PORT" || humanas==true && list.name=="INGLES"){
                return (
                    <View>
                        <Modal transparent={true} animationType="slide" visible={this.state.showListVisible} onRequestClose={()=> this.toggleListModal()} swipeDirection={'right'} propagateSwipe>
                            <View style={{padding:5, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%'}}>
                                <ToDoModal list={list} closeModal={() => this.toggleListModal()} updateList={this.props.updateList} swipeDirection={'right'} propagate/>
                            </View>
                        </Modal>
                        <View style={{right: -5,flexDirection: 'row', width: ( (Dimensions.get('window').width*50)/100) }}>
                            {
                            <TouchableOpacity style={[styles.listContainer, {backgroundColor: list.color}]} onPress={()=> this.toggleListModal()}>
                                <Text style={styles.listTitle} numberOfLines={1}>
                                    {list.name}
                                </Text>
                
                                    
                                {
                                    this.state.nextActivityDay=="NaN/NaN/NaN"?
                                        <Text style={{fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma atividade{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE PARA HOJE"?
                                        <Text style={{fontSize: 19, textAlign: 'center', color: "#ffe570", fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE ATRASADA"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="Próxima tarefa em: NaN/NaN/NaN"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma Atividade{"\n"}</Text>:
                    
                                        <Text style={{fontSize: 20, textAlign: 'center', color:"#2c4a8f", fontFamily: 'Helvetica-Nue-Condensed'}}>Próxima tarefa em: {String(this.state.nextActivityDay)}{"\n"}</Text>
                                }
                                    
                                <View style={{flexDirection: 'row', bottom: 25}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{completedCount}</Text>
                                        <Text style={styles.subtitle}>Completas</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{remainingCount}</Text>
                                        <Text style={styles.subtitle}>   Faltando</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            }
                
                                
                            </View>
                            
                            
                    </View>
                )
            }
            if(biologicas==true && list.name=="BIO" || biologicas==true && list.name=="ED.FISICA" || biologicas==true && list.name=="QUI"){
                return (
                    <View>
                        <Modal transparent={true} animationType="slide" visible={this.state.showListVisible} onRequestClose={()=> this.toggleListModal()} swipeDirection={'right'} propagateSwipe>
                            <View style={{padding:5, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%'}}>
                                <ToDoModal list={list} closeModal={() => this.toggleListModal()} updateList={this.props.updateList} swipeDirection={'right'} propagate/>
                            </View>
                        </Modal>
                        <View style={{right: -5,flexDirection: 'row', width: ( (Dimensions.get('window').width*50)/100) }}>
                            {
                            <TouchableOpacity style={[styles.listContainer, {backgroundColor: list.color}]} onPress={()=> this.toggleListModal()}>
                                <Text style={styles.listTitle} numberOfLines={1}>
                                    {list.name}
                                </Text>
                
                                    
                                {
                                    this.state.nextActivityDay=="NaN/NaN/NaN"?
                                        <Text style={{fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma atividade{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE PARA HOJE"?
                                        <Text style={{fontSize: 19, textAlign: 'center', color: "#ffe570", fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE ATRASADA"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="Próxima tarefa em: NaN/NaN/NaN"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma Atividade{"\n"}</Text>:
                    
                                        <Text style={{fontSize: 20, textAlign: 'center', color:"#2c4a8f", fontFamily: 'Helvetica-Nue-Condensed'}}>Próxima tarefa em: {String(this.state.nextActivityDay)}{"\n"}</Text>
                                }
                                    
                                <View style={{flexDirection: 'row', bottom: 25}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{completedCount}</Text>
                                        <Text style={styles.subtitle}>Completas</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{remainingCount}</Text>
                                        <Text style={styles.subtitle}>   Faltando</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            }
                
                                
                            </View>
                            
                            
                    </View>
                )
            }
            if(tecnico==true && list.name=="PC" || tecnico==true && list.name=="DS"  || tecnico==true && list.name=="REDES" || tecnico==true && list.name=="TCC" || tecnico==true && list.name=="T.MOBILE"  ){
                return (
                    <View>
                        <Modal transparent={true} animationType="slide" visible={this.state.showListVisible} onRequestClose={()=> this.toggleListModal()} swipeDirection={'right'} propagateSwipe>
                            <View style={{padding:5, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%'}}>
                                <ToDoModal list={list} closeModal={() => this.toggleListModal()} updateList={this.props.updateList} swipeDirection={'right'} propagate/>
                            </View>
                        </Modal>
                        <View style={{right: -5,flexDirection: 'row', width: ( (Dimensions.get('window').width*50)/100) }}>
                            {
                            <TouchableOpacity style={[styles.listContainer, {backgroundColor: list.color}]} onPress={()=> this.toggleListModal()}>
                                <Text style={styles.listTitle} numberOfLines={1}>
                                    {list.name}
                                </Text>
                
                                    
                                {
                                    this.state.nextActivityDay=="NaN/NaN/NaN"?
                                        <Text style={{fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma atividade{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE PARA HOJE"?
                                        <Text style={{fontSize: 19, textAlign: 'center', color: "#ffe570", fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="ATIVIDADE ATRASADA"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>{String(this.state.nextActivityDay)}{"\n"}</Text>:
                
                                    this.state.nextActivityDay=="Próxima tarefa em: NaN/NaN/NaN"?
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'rgba(52, 52, 52, 0.8)', fontFamily: 'Helvetica-Nue-Condensed'}}>Nenhuma Atividade{"\n"}</Text>:
                    
                                        <Text style={{fontSize: 20, textAlign: 'center', color:"#2c4a8f", fontFamily: 'Helvetica-Nue-Condensed'}}>Próxima tarefa em: {String(this.state.nextActivityDay)}{"\n"}</Text>
                                }
                                    
                                <View style={{flexDirection: 'row', bottom: 25}}>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{completedCount}</Text>
                                        <Text style={styles.subtitle}>Completas</Text>
                                    </View>
                                    <View style={{alignItems: 'center'}}>
                                        <Text style={styles.count}>{remainingCount}</Text>
                                        <Text style={styles.subtitle}>   Faltando</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            }
                                
                            </View>
                    </View>
                )
            }
            else{
                return(
                    <></>
                )
            }
        }
        
        }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 32,
        borderRadius: 6,
        marginHorizontal: 12,
        alignItems: 'center',

        
        
        width: '87%',
        height: 230,
        margin: 20,
        left: 10,

        borderLeftWidth: 6,
        borderBottomWidth: 6,
        borderRightWidth: 1.7,
        borderTopWidth:1.7
        
    },
    listTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 18,
        borderBottomWidth: 2
    },
    count: {
        fontSize: 38,
        fontWeight: '200',
        color: Colors.white
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.white
    }
})
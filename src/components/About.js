import React, { Component } from 'react';
import {
  Container,
  Platform,
  Text,
  View,
  StyleSheet,
  Button,
  Linking,
  AppState,
  AsyncStorage,
  Vibration,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Actions, Reducer } from 'react-native-router-flux'; 
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import * as firebase from 'firebase';
import {Notifications} from 'expo';
import * as TaskManager from 'expo-task-manager';



const LOCATION_TASK_NAME = 'background-location-task';

export default class About extends Component {
  constructor(props){
    super(props)

    this.state = ({
       appState: AppState.currentState,
       location:null,
       errorMessage: null, 
       online: false   
    })
     
    this.register = this.register.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
 }
 
 async _getLocationAsync(){
   let  currentUser = firebase.auth().currentUser.uid.toString();
   const {status1} = await Permissions.askAsync(Permissions.LOCATION);
   console.log(status1)
      if (status1 !== 'granted') {
         this.setState({
         errorMessage: 'Permission to access location was denied',
         });
      }
      let location = await Location.getCurrentPositionAsync({})
      this.setState(location) 
      console.log(location.coords.latitude, location.coords.longitude)
     firebase.database().ref('Users/' + currentUser).update({ 
        Latitud: location.coords.latitude,
        Longitud: location.coords.longitude
     })  
   
};

 async register(){
    let  currentUser = firebase.auth().currentUser.uid.toString();
    let emai = firebase.auth().currentUser.email.toString();
    const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(status)
 if(status !== 'granted'){
    alert('You need to enable permissions in settings')
    return
 }
    let token = await Notifications.getExpoPushTokenAsync();
   console.log(token)
// POST the token in firabase.
   firebase.database().ref('Users/' + currentUser).update({
   Expotoken: token,
   Email: emai,
   UID: currentUser,
   online: true
   });
   //firebase.database().ref('/Users/').on('value', snapshot => {
   // const firabasedata = snapshot.val();
    //console.log(firabasedata);                
  //});
}

async componentWillMount(){
   this.register();
   this._getLocationAsync();
   this.listener =  Notifications.addListener(this.listen)
}

  async componentDidMount(){
    console.log("Hello")
    AppState.addEventListener('change', this.handleAppStateChange)
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced, timeInterval:1000, distanceInterval:5
    })
 }


 componentWillUnmount(){
    this.listener.remove();
    AppState.removeEventListener('change', this.handleAppStateChange)
    this.startLocationUpdatesAsync.remove()
 }
 
 listen = ({origin,data}) => {
    console.log(origin,data)
    Vibration.vibrate(10000)
    let nombre = data.name;
    let apellido = data.ape;
    if(origin === 'received'){  // Para evitar doble received y selected en origin
    setTimeout(function(){

       Vibration.vibrate(10000)
       Alert.alert(
          nombre,
          apellido,
          [
             {
                text: "Rechazar",
                onPress: () => console.log("Rejected")
             },
             {
                text: "Aceptar",
                onPress: () => console.log("Accepted")
             }
          ],
          {cancelable: false}
       )
  
     }, 5000);    // Timeout para que cuando se abra la app le llegue la  notificación
    }

    
    
 }

 handleAppStateChange = (nextAppState) => {
    if (
       this.state.appState.match(/inactive|background/) &&
       nextAppState === 'active'
     ) {
       console.log('App has come to the foreground!');
     }
     this.setState({appState: nextAppState});
     console.log(this.state.appState)
 }

 async signOutUser() {
   try {
       await firebase.auth().signOut();
       Actions.Home()
   } catch (error) {
       console.log(error);
   }
}

 render(){
    
 
  
 return (
   
   <View style={styles.justifyContent}>
   <Button style={{margin:35}} 
    full
    rounded
    success 
    title="logout" onPress={() => this.signOutUser()} />
   <Text style={styles.paragraph}></Text>
   </View>
 )
}
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  }
});

TaskManager.defineTask('background-location-task' , ({ data, error }) => {
   
   if (error) {
     // Error occurred - check `error.message` for more details.
     return;
   }
      if (data) {
         const { locations } = data;
         // do something with the locations captured in the background
         console.log('locations',locations[0].coords.latitude,locations[0].coords.longitude)
         let  currentUser = firebase.auth().currentUser.uid.toString();
         firebase.database().ref('Users/' + currentUser).update({ 
            Latitud: locations[0].coords.latitude,
            Longitud: locations[0].coords.longitude
         })  
       }
   
 });
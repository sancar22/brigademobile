import React, { Component, useState, useEffect, useCallback} from 'react';
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
import {useSelector, useDispatch} from 'react-redux'
import {notifshow} from '../actions/index'
import _ from 'lodash'


function About () {
   const brigada = useSelector(state => state.brigada)
   const dispatch = useDispatch()

   register();
  firebase.auth().onAuthStateChanged((user)=>{
     if(!user){
        Actions.home()
     }
  })
 async function register(){
    let  currentUser = firebase.auth().currentUser.uid.toString();
    firebase.database().ref('Users/' + currentUser).on("value", snapshot =>{
      const info = snapshot.val().notif
      dispatch(notifshow(info))
   })
   
    let emai = firebase.auth().currentUser.email.toString();
    const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(status)
 if(status !== 'granted'){
    alert('You need to enable permissions in settings')
    return
 }
    let token = await Notifications.getExpoPushTokenAsync();
   console.log(token)
    console.log(brigada, brigada)
   firebase.database().ref('Users/' + currentUser).update({
   Expotoken: token,
   Email: emai,
   UID: currentUser,
   online: true,
   selected:false
   });
}
useEffect(()=>{
   this.listener = Notifications.addListener(listen)
   return()=>{
      this.listener.remove()
   }
},[])



 const listen = ({origin,data}) => {
    console.log(origin,data)
   
 }

  async function signOutUser() {
   try { 
      let currentUser =  firebase.auth().currentUser.uid.toString();
      firebase.database().ref('Users/' + currentUser).update({ 
      online:false,
      selected: false
   })  
       await firebase.auth().signOut();
       Actions.home()
   } catch (error) {
       console.log(error);
   }
}

 
    
 
  
 return (
   
   <View style={styles.justifyContent}>
   {brigada ?   
   <View>
   <Button
    full
    rounded
    success 
    title="Rechazar" onPress={() => Actions.forgot()} 
    />
     <Button
    full
    rounded
    success 
    title="Aceptar" onPress={() => Actions.about()} 
    />
    </View> : 
    <View> 
      <Button style={{margin:35}} 
    full
    rounded
    success 
    title="logout" onPress={() => signOutUser()} 
    />
    </View>
    }
      
    </View>
  
 )

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  }
});

export default About
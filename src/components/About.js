import React, { Component, useState, useEffect, useCallback, useLayoutEffect } from "react";
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
  TouchableOpacity, 
  Dimensions
} from "react-native";
import { Actions, Reducer } from "react-native-router-flux";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import { Notifications } from "expo";
import { useSelector, useDispatch } from "react-redux";
import { notifshow, fillPlace,fillCode,fillCategory,fillDescription,fillInfo } from "../actions/index";
import _ from "lodash";
import {calcWidth, calcHeight} from '../HelpFunctions'

function About() {
  const brigada = useSelector(state => state.brigada); //Variable que controlará la visibilidad de la notificación
  const infoOnline = useSelector(state => state.info)
  const caso = useSelector(state=>state.case)
  const dispatch = useDispatch();
   
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      Actions.replace('home');
    }
  });

  useEffect(() => {
    console.log("Mounted About")
    initializer();
    //updateUser()
    register();
    this.listener = Notifications.addListener(listen);
    return () => {
      console.log("Unmounted About")
      this.listener.remove();
    };
  }, []);
  
function initializer(){
  // When component mounts, there will be a listener for notif sent
  let currentUser = firebase.auth().currentUser.uid.toString();
  firebase
    .database()
    .ref("Users/" + currentUser).child("notif")
    .on("value", snapshot => { 
      console.log(snapshot.val())
      const info = snapshot.val()
      dispatch(notifshow(info));
    });
}

  async function register() { // se pide expoToken, se actualiza y se pone online en firebase
    let currentUser = firebase.auth().currentUser.uid.toString();
    let emai = firebase.auth().currentUser.email.toString();
    const { status } =  await  Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(status);
    if (status !== "granted") {
      alert("You need to enable permissions in settings");
      return;
    }
    let token =  await Notifications.getExpoPushTokenAsync();
    console.log(token);
    firebase
      .database()
      .ref("Users/" + currentUser)
      .update({
        Expotoken: token,
        Email: emai,
        UID: currentUser,
        online: true,
        selected: false
      });
  }


  const listen = ({ origin, data }) => {
    console.log(origin, data); 
    let currentUser = firebase.auth().currentUser.uid.toString();
 
      if(origin === 'received'){
        Vibration.vibrate(10000);
           
        firebase
        .database()
        .ref("Users/" + currentUser)
        .once("value", snapshot => {
        const userInfo = snapshot.val()
        const notifs = snapshot.val().receivedNotif +1 // aumentar notificaciones recibidas

        firebase.database().ref("Casos/" + currentUser + userInfo.receivedNotif) // Para updatear la variable de Redux de caso
        .once("value", snapshot =>{
          const caseInfo = snapshot.val()
          dispatch(fillPlace(caseInfo.lugar))
          dispatch(fillCode(caseInfo.codigo))
          dispatch(fillDescription(caseInfo.descripcion))
          dispatch(fillCategory(caseInfo.categoria))
        })
        firebase.database().ref("Users/" + currentUser).update({receivedNotif:notifs})
    // se updatea +1 
     })

        firebase.database().ref("Users/"+currentUser).update({notif:true})
        }   
  };

  async function signOutUser() {
    try {
      let currentUser = firebase.auth().currentUser.uid.toString();
      firebase
        .database()
        .ref("Users/" + currentUser)
        .update({
          online: false,
          selected: false
        });
       
      await firebase.auth().signOut();
      Actions.replace('home');
    } catch (error) {
      console.log(error);
    }
  }
  
  const rejectCase = () =>{
   let currentUser = firebase.auth().currentUser.uid.toString();
   firebase
   .database()
   .ref("Users/" + currentUser)
   .once("value",snapshot=>{
      const newRejected = snapshot.val().rejected + 1
      firebase.database().ref("Users/"+currentUser).update({rejected:newRejected})
   })
  firebase.database().ref("Users/" +currentUser).update({notif:false}) 
  // Para cuando rechace la notificación se oculte la notificación
  }
  
  const acceptCase = () =>{
   let currentUser = firebase.auth().currentUser.uid.toString();
   firebase
      .database()
      .ref("Users/" + currentUser)
      .once("value",snapshot=>{
         const newAccepted = snapshot.val().accepted + 1
         firebase.database().ref("Users/"+currentUser).update({accepted:newAccepted})
      })
      firebase.database().ref("Users/" +currentUser).update({notif:false})
      Actions.replace('caso') // Si acepta se va a la ventana de casos
  }

  return (
    <View >
      {brigada ? (
      
         


        <View style={{flex:1, flexDirection:'row',justifyContent:'space-evenly', position:'relative'}}>
          <TouchableOpacity 
          style={{...styles.touchOpBut,backgroundColor:'red'}}  
          onPress={rejectCase}>
             <Text style={styles.button}>RECHAZAR</Text>
          </TouchableOpacity>
      
          <TouchableOpacity 
          style={{...styles.touchOpBut, backgroundColor:'green'}} 
          onPress={acceptCase}>
             <Text style={styles.button}>ACEPTAR</Text>
          </TouchableOpacity>
        </View>


        
      ) : (
        <View  style={{ position:'relative', top:500 }} >
          <Button
           
            full
            rounded
            success
            title="logout"
            onPress={() => signOutUser()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  },
  button: {
   color:"white",
   fontWeight:"bold",
   textAlign:"center", 
   paddingVertical:13
  },
  touchOpBut:{
   flexDirection:'column',
   height: calcHeight(6), 
   width: calcWidth(30), 
   top: calcHeight(75),
   position:"relative", 
   borderRadius:10
  }
});

export default About;

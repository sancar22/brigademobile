import React, { Component, useState, useEffect, useCallback } from "react";
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
  const info = useSelector(state => state.info)
  
  const dispatch = useDispatch();
  let {height, width} = Dimensions.get('window')
  console.log(height,width)

  useEffect(() => {
    console.log("Mounted About")
    
    let currentUser = firebase.auth().currentUser.uid.toString();
    this.listener = Notifications.addListener(listen);
    firebase
    .database()
    .ref("Users/" + currentUser)
    .on("value", snapshot => {
      const info = snapshot.val().notif;
     const infoTot = snapshot.val()
      dispatch(notifshow(info));
      dispatch(fillInfo(infoTot))

    });
    register();
    return () => {
      console.log("Unmounted About")
      this.listener.remove();
    };
  }, []);

  useEffect(()=>{
      
   console.log(info)

  }, [info])




  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      Actions.replace('home');
    }
  });


  async function register() {
    let currentUser = firebase.auth().currentUser.uid.toString();

    //Controlador para mostrar la notificación
  
    ////////////////////////////////////////////////////////////////////
     
    let emai = firebase.auth().currentUser.email.toString();
    const { status } =  await  Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(status);
    if (status !== "granted") {
      alert("You need to enable permissions in settings");
      return;
    }
    let token =  await Notifications.getExpoPushTokenAsync();
    console.log(token);
    console.log(brigada, brigada);
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
    if(origin === 'received'){
      Vibration.vibrate(10000);
      ranTime();
      
      
      

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
      .transaction((data)=>{
         data.rejected++
         return data;
      })
  firebase.database().ref("Users/" +currentUser).update({notif:false})
  
  }

  const ranTime = () =>{
    let currentUser = firebase.auth().currentUser.uid.toString();
    firebase
       .database()
       .ref("Users/" + currentUser)
       .transaction((data)=>{
          data.receivedNotif++
          return data;
       })
   
   }

  
  const acceptCase = () =>{
   let currentUser = firebase.auth().currentUser.uid.toString();
   firebase
      .database()
      .ref("Users/" + currentUser)
      .transaction((data)=>{
         data.accepted++
         return data;
      })
      firebase.database().ref("Users/" +currentUser).update({notif:false})
    
      Actions.replace('caso')
  
  }

  return (
    <View>
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

import React, {useEffect, useCallback} from 'react'
import {
    Container,
    Platform,
    Text,
    View,
    StyleSheet,
    Linking,
    AppState,
    AsyncStorage,
    Vibration,
    Alert,
    TouchableOpacity, 
    Dimensions,
    BackHandler
  } from "react-native";
  import {Button} from 'native-base'
  import { Actions, Reducer } from "react-native-router-flux";
  import * as firebase from "firebase";

function Case () {

    const handleBackButton = useCallback(() => {
        return true
    })


    useEffect(() =>{
        console.log("Mounted Case")
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            console.log("Unmounted Case")
          BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
      }, []);

      const back = () => {
        let currentUser = firebase.auth().currentUser.uid.toString();
        Number.prototype.padLeft = function(base,chr){
          var  len = (String(base || 10).length - String(this).length)+1;
          return len > 0? new Array(len).join(chr || '0')+this : this;
        }
        let d = new Date,
        dformat = [(d.getMonth()+1).padLeft(),
                   d.getDate().padLeft(),
                   d.getFullYear()].join('/') +' ' +
                  [d.getHours().padLeft(),
                   d.getMinutes().padLeft(),
                   d.getSeconds().padLeft()].join(':');
        
        firebase.database().ref("Users/"+ currentUser).once("value", snapshot =>{
           let notif = snapshot.val().receivedNotif
           firebase.database().ref("Casos/"+ currentUser + (notif-1).toString())
           .once("value", snapshot =>{
                
           let initialSec = snapshot.val().tInicial
           let finishTime = Date.now()/1000;
           let tTrans = finishTime-initialSec
           
           firebase.database().ref("Casos/" + currentUser + (notif-1).toString())
           .update({finalFecha:dformat,tTranscurrido:tTrans, tFinal:finishTime})
           })
         
        })
        firebase.database().ref("Users/" + currentUser).update({ocupado:false})
        Actions.replace('about')
      }
    return (
        <View>
             <Button
          style={{ marginTop: 10 }} // Login button
          full
          rounded
          success
          onPress={back}
        >
          <Text>Devolverse</Text>
        </Button>
        </View>
    )


}

export default Case
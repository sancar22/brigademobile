import React, { useEffect, useCallback, useState } from "react";
import { Text, View, BackHandler } from "react-native";
import { Button } from "native-base";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import fb from "../routes/ConfigFire";


function Case() {

  const handleBackButton = useCallback(() => {
    return true;
  });
  const infoUser = useSelector(state => state.info);
  const [webToken, setWebToken] = useState("");
  const [timer, setTimer] = useState(0)
 
  let currentUser = firebase
    .auth()
    .currentUser.email.toString()
    .split(".")[0];
useEffect(()=>{
  console.log(timer)
},[timer])
  useEffect(() => {
    console.log("Mounted Caseee1");
    let timerCase = setInterval(()=>{
      fb.closeCase(currentUser)
      setTimer(prevTime => prevTime + 1)
    },1000)
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    getFBInfo();
    return () => {
      console.log("Unmounted Case");
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
      clearInterval(timerCase)
    };
  }, []);

  useEffect(() => {
    console.log(webToken);
  }, [webToken]);
  const getFBInfo = () => {
    firebase
      .database()
      .ref("/Users/santiagoyacaman@uninorte")
      .on("value", snapshot => {
        setWebToken(snapshot.val().pushToken);
      });
  };
  const back = () => {
    // let currentUser = firebase.auth().currentUser.uid.toString();

    fb.closeCase(currentUser);
    fb.updateBusy(currentUser);
    Actions.replace("about");
  };

  const extintor = () => {
    const extint = "extintor";
    const genero = "un";
    pushWeb(extint, genero);
  };

  const camilla = () => {
    const genero = "una";
    const camill = "camilla";
    pushWeb(camill, genero);
    console.log("Camilla");
  };

  const pushWeb = (objeto, genero) => {
    const PUSH_ENDPOINT = "https://fcm.googleapis.com/fcm/send";
    let key =
      "AAAAppNbUYM:APA91bFd8gfd0fq0Jq8Crskxl5Ah4abkpQUmtrUjsTIQ17nsPK_jvb07JSvvNcBpNpFU_d3yjpR0KtMgRqHQRJpOUMN4iAsQNT7qjRzRmzr5bkUM7uF8M165De9OuYqrUhBmLoeCDImp";
    let to = webToken;
    let notification = {
      body: `El brigadista ${infoUser.nombre +
        " " +
        infoUser.apellido} requiere  ${genero + " " + objeto}.`,
      objeto: `${objeto}`,
      click_action: "http://localhost:3000",
      requireInteraction: true
    };
    fetch(PUSH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "key=" + key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: notification,
        to: to
      })
    })
      .catch(err => {
        alert(`Error en solicitud de ${objeto}. Vuelva a intentarlo.`);
      })
      .then(() => {
        alert(`Objeto: ${objeto} solicitad@`);
      });
  };

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
      <Button
        style={{ marginTop: 100 }} // Login button
        full
        rounded
        success
        onPress={extintor}
      >
        <Text>Extintor</Text>
      </Button>
      <Button
        style={{ marginTop: 100 }} // Login button
        full
        rounded
        success
        onPress={camilla}
      >
        <Text>Camilla</Text>
      </Button>
  <Text>{new Date(timer * 1000).toISOString().substr(11, 8)}</Text>
    </View>
  );
}

export default Case;

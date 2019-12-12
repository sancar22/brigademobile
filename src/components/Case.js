import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "native-base";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import fb from "../routes/ConfigFire";

function Case() {
    const infoUser = useSelector(state => state.info);
    const [webToken, setWebToken] = useState("");
    const [timer, setTimer] = useState(0);
    let currentUser = firebase
        .auth()
        .currentUser.email.toString()
        .split(".")[0];

    useEffect(() => {
        console.log("Mounted Caseee1");
        let timerCase = setInterval(() => {
            fb.closeCase(currentUser);
            setTimer(prevTime => prevTime + 1);
        }, 1000);

        getFBInfo();
        return () => {
            console.log("Unmounted Case");
            clearInterval(timerCase);
        };
    }, []);

    const getFBInfo = () => {
        firebase
            .database()
            .ref("/Users/admin@gmail")
            .on("value", snapshot => {
                setWebToken(snapshot.val().pushToken);
            });
    };
    const back = () => {
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
    };

    const pushWeb = (objeto, genero) => {
        fb.sendWebNotification(webToken, infoUser, genero, objeto);
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

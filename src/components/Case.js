import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "native-base";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import fb from "../routes/ConfigFire";
import { Notifications } from "expo";

function Case() {
    const infoUser = useSelector(state => state.info);
    const [webToken, setWebToken] = useState("");

    let currentUser = firebase
        .auth()
        .currentUser.email.toString()
        .split(".")[0];

    useEffect(() => {
        console.log("Mounted Caseee1");

        getFBInfo();
        return () => {
            console.log("Unmounted Case");
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
        fb.requestExt(currentUser, infoUser);
        pushWeb(extint, genero);
    };

    const camilla = () => {
        const genero = "una";
        const camill = "camilla";
        fb.requestCam(currentUser, infoUser);
        pushWeb(camill, genero);
    };

    const pushWeb = (objeto, genero) => {
        fb.sendWebNotification(webToken, infoUser, genero, objeto);
    };

    return (
        <View>
            <Button
                style={{ marginTop: 30 }} // Login button
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
        </View>
    );
}

export default Case;

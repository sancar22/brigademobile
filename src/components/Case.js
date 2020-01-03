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

        return () => {
            console.log("Unmounted Case");
        };
    }, []);

    const back = () => {
        fb.closeCase(currentUser);
        fb.updateBusy(currentUser);
        Actions.replace("about");
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
        </View>
    );
}

export default Case;

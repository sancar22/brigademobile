import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import NotificationContainer from "./NotificationContainer";
import { useSelector, useDispatch } from "react-redux";
import * as firebase from "firebase";
import {
    fillPlace,
    fillCode,
    fillCategory,
    fillDescription,
    fillDate
} from "../actions/index";
function Case2(props) {
    const dispatch = useDispatch();
    let currentUser = firebase
        .auth()
        .currentUser.email.toString()
        .split(".")[0];
    const infoUser = useSelector(state => state.info);
    const [timer, setTimer] = useState(null);
    const caso = useSelector(state => state.case);
    useEffect(() => {
        console.log("Date");
        const timer = setInterval(() => {
            let a = new Date();
            setTimer(Math.round((a - caso.date) / 1000));
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [caso.date]);
    useEffect(() => {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .once("value", snapshot => {
                const caseInfo = snapshot.val();
                dispatch(fillPlace(caseInfo.lugar));
                dispatch(fillCode(caseInfo.codigo));
                dispatch(fillDescription(caseInfo.descripcion));
                dispatch(fillCategory(caseInfo.categoria));
                dispatch(fillDate(caseInfo.date));
            });
    }, []);

    return (
        <NotificationContainer
            codigo={caso.codigo}
            lugarEmergencia={caso.lugarEmergencia}
            categoria={caso.categoria}
            descAdicional={caso.descAdicional}
            timer={new Date(timer * 1000).toISOString().substr(11, 8)}
            button={false}
        />
    );
}

export default Case2;

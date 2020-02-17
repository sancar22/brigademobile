import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import HelpContainer from "./HelpContainer";
import { useSelector, useDispatch } from "react-redux";
import * as firebase from "firebase";
import { fillAll } from "../actions/index";

import { Actions } from "react-native-router-flux";
function HelpCase(props) {
    const dispatch = useDispatch();
    const caso = useSelector(state => state.case);
    const infoUser = useSelector(state => state.info);

    if (infoUser.helpOcupado === false) {
        Actions.replace("about");
    }

    useEffect(() => {
        firebase
            .database()
            .ref(
                "Casos/" +
                    infoUser.apoyandoEmail +
                    (infoUser.apoyandoNotifRec - 1).toString()
            )
            .on("value", snapshot => {
                const caseInfo = snapshot.val();
                dispatch(fillAll(caseInfo));
            });
    }, []);

    return (
        <HelpContainer
            codigo={caso.codigo}
            lugar={caso.lugar}
            categoria={caso.categoria}
            descripcion={caso.descripcion}
            nombre={caso.nombre}
            apellido={caso.apellido}
            button={false}
        />
    );
}

export default HelpCase;

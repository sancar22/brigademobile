import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "native-base";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import { Notifications } from "expo";
import Textarea from "react-native-textarea";
import fb from "../routes/ConfigFire";
import { calcWidth, calcHeight } from "../HelpFunctions";
import { CheckBox } from "react-native-elements";

function Case() {
    const caso = useSelector(state => state.case);
    const infoUser = useSelector(state => state.info);
    const allInfo = useSelector(state => state.allInfo);
    const vinculatedBrigaders = allInfo.filter(
        info => info.apoyandoEmail === infoUser.Email.split(".")[0]
    );
    const checkBoxContainer = vinculatedBrigaders.map(item => {
        return (
            <CheckBox
                title={item.nombre + " " + item.apellido}
                checked={item.trulyHelped}
                onPress={() =>
                    changeHelped(item.Email.split(".")[0], item.trulyHelped)
                }
            />
        );
    });
    const changeHelped = (email, trulyHelped) => {
        firebase
            .database()
            .ref("Users/" + email)
            .update({ trulyHelped: !trulyHelped });
    };

    const [textArea, setTextArea] = useState("");
    console.log(allInfo);
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
        fb.updateTimer(caso.date, currentUser, infoUser);
        fb.removeHelper(vinculatedBrigaders, currentUser, infoUser);
        Actions.replace("about");
    };

    const handleText = val => {
        fb.updateAdditionalInfo(val, currentUser, infoUser);
        setTextArea(val);
    };

    return (
        <View>
            <Text style={styles.text}>Apoyos Brigadistas: </Text>

            {checkBoxContainer.length > 0 && checkBoxContainer}
            <Text style={styles.text}>Descripción Adicional</Text>
            <Textarea
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                onChangeText={val => handleText(val)}
                defaultValue={caso.descBrigadista}
                maxLength={1000}
                placeholder={""}
                placeholderTextColor={"#c7c7c7"}
                underlineColorAndroid={"transparent"}
            />
            <Button
                style={{ marginTop: 30 }} // Login button
                full
                rounded
                success
                onPress={back}
            >
                <Text>CASO ATENDIDO</Text>
            </Button>
        </View>
    );
}
const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        fontWeight: "bold",
        paddingTop: 20,
        paddingBottom: 10
    },

    textareaContainer: {
        height: calcHeight(30),
        padding: calcHeight(1),
        width: calcWidth(95),
        marginLeft: calcWidth(2.5),
        borderRadius: 10,
        backgroundColor: "#F5FCFF"
    },
    textarea: {
        textAlignVertical: "top",
        height: 170,
        fontSize: 14,
        color: "#333"
    }
});
export default Case;

import React, { useState, useEffect } from "react";
import { Actions } from "react-native-router-flux"; //npm i react-native-router-flux --save
import { config } from "../routes/Config";
import * as firebase from "firebase"; // npm install --save react-native-firebase
import { Container, Form, Input, Item, Button, Label } from "native-base";
import { StyleSheet, Text, ActivityIndicator, Image } from "react-native";
import {Asset} from 'expo-asset'
import SignInC from './SignInC'
import {AppLoading} from 'expo'

// This is the login Window
function cacheImage(images){
    return images.map(images => {
        if(typeof image === "string"){
            return Image.prefetch(image)
        }else{
            return Asset.fromModule(image).downloadAsync()
        }
    })
}
function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false)

    let authFlag = true;
    firebase.auth().onAuthStateChanged(user => {
        if (authFlag) {
            authFlag = false;
            if (user) {
                Actions.replace("about");
            }
        }
    });
    const loginUser = (email, password) => {
        try {
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(email.trim(), password)
                .then(() => {
                    setLoading(false);
                    Actions.replace("about"); // If user is registered it will go to about page
                });
        } catch (error) {
            console.log(error.toString());
        }
    };
    const emailHandler = (email) => {
        setEmail(email)
    }
    const passwordHandler = (password) => {
        setPassword(password)
    }
    const loadAssetsAsync = async() =>{
        const imageAssets = cacheImage([require('../../assets/uni2.jpg')])
        await Promise.all([...imageAssets]) // Colocar Logo brigada también
    }
    return (
<Container>
        {isReady ? <AppLoading
            startAsync={loadAssetsAsync}
            onFinish={()=> setIsReady(true)}
            onError={console.warn}
            /> :  
            <SignInC
                loading={loading}
                loginUser={loginUser}
                emailHandler={emailHandler}
                passwordHandler={passwordHandler}
                email={email}
                password={password}
            />
        } 
    </Container>
       
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",

    },
});

export default Home;

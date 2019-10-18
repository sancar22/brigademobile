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
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
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
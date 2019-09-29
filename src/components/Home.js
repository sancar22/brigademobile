import React from 'react'
import { Actions, Reducer } from 'react-native-router-flux'; //npm i react-native-router-flux --save
import {config} from '../routes/Config' 
import * as firebase1 from 'firebase'; // npm install --save react-native-firebase
import {Container, Content, Header, Form, Input, Item, Button, Label} from 'native-base';
import {StyleSheet, Text, ActivityIndicator} from 'react-native'



// This is the login Window


firebase1.initializeApp(config); // initialize firebase with our config located in src/routes/Routes.js

class Home extends React.Component {
   
   constructor(props){
      super(props)
       
      this.state = ({
         email: '',
         password: '',
         loading: false,
      })
      

      this.loginUser = this.loginUser.bind(this)
      this.signUpUser = this.signUpUser.bind(this)
   }
   


   loginUser = (email,password) => {
      try{
         this.setState({loading:true})
         firebase1.auth().signInWithEmailAndPassword(email.trim(),password).then(() => { 
            let Unique = firebase1.auth().currentUser.uid.toString();
            let emai = firebase1.auth().currentUser.email.toString();
            console.log(emai)
            this.setState({loading:false})
            Actions.about() // If user is registered it will go to about page  
            
         })  
      }catch(error){
         console.log(error.toString())
      }
   }
   
   signUpUser = (email, password) => {
      try{
         if(this.state.password.length<6){
            alert("Please enter at least 6 characters")
            return;
         }
         firebase1.auth().createUserWithEmailAndPassword(email.trim(),password) // Register user in firebase
      }catch(error){
         console.log(error.toString())
      }
   }

   render(){
      console.log(this.state.email)
   return (

        <Container style={styles.container}>
           <Form>
              <Item floatingLabel>
                 <Label>Email</Label> 
                 <Input
                     autoCorrect = {false}
                     autoCapitalize = "none"
                    onChangeText = {(email) => this.setState({email:email})} // Constantly update email
                 />
              </Item>

              <Item floatingLabel>
                 <Label>Password</Label>
                 <Input
                     secureTextEntry = {true}
                     autoCorrect = {false}
                     autoCapitalize = "none"
                     onChangeText = {(password) => this.setState({password:password})} // Constantly update password
                 />
              </Item>

              <Button style={{marginTop:10}} // Login button
               full
               rounded
               success
              onPress = {() => this.loginUser(this.state.email,this.state.password)}  
              >
                  <Text>Login</Text>
              </Button>

              <Button style={{margixnTop:10}} // Forget button
               full
               rounded
               primary
               onPress = {()=> Actions.forgot()}
              >
                  <Text>Forgot PWRD</Text>
              </Button>

              <Button style={{margixnTop:10}} // Forget button
               full
               rounded
               success
               onPress = {()=> this.signUpUser(this.state.email, this.state.password)}
              >
                  <Text>Sign Up</Text>
              </Button>
              {this.state.loading && <ActivityIndicator/>}

              

           </Form>
        </Container>
      
   )
}
}

const styles = StyleSheet.create({
   container: {
      flex:1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 10
   }
})




export default Home
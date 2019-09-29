import React from 'react'
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import {Container, Content, Header, Form, Input, Item, Button, Label} from 'native-base';
import {StyleSheet, Text} from 'react-native'



class ForgotPassWord extends React.Component {
   
   constructor(props){
      super(props)

      this.state = ({
         email: ''
      })
      this.resetPass = this.resetPass.bind(this)
   }
   
   resetPass = (email) => {
    try{
       firebase.auth().sendPasswordResetEmail(email).then(() => { 
          alert("Check your email to reset your password")
          Actions.home(); // Return to home
          
       })  
    }catch(error){
       console.log(error.toString())
    }
 }
   
   

   render(){
      
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

              <Button style={{marginTop:10}} // Send password reset option to email
               full
               rounded
               success
              onPress = {() => this.resetPass(this.state.email)}  
              >
                  <Text>Reset Password</Text>
              </Button>

             

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




export default ForgotPassWord
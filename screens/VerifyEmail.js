import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const VerifyEmail = ({navigation, route}) => {

  console.log('navigation', navigation)
  console.log('route', route.params);

  const email = route.params[0]['email'];
  const password = route.params[0]['password'];
  const [confirmationCode, setConfirmationCode] = useState([]);

  const confirmUser = async () => {

    const bodyParams = {}
    bodyParams['confirmationCode'] = confirmationCode;
    bodyParams['email'] = email;

    console.log('bodyParams', bodyParams)

    const response = await fetch(`https://ormrcait2fgxnc5bnwwn6j5kyu0vidjb.lambda-url.us-west-1.on.aws/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(bodyParams)
    });
    console.log('response', response.status)
    const output = await response.json();
    console.log(output)

    if (response.status != '200') return;
    navigation.navigate('SignIn', []);
  }

  const resendVerification = async () => {

    const bodyParams = {}
    bodyParams['password'] = password;
    bodyParams['email'] = email;

    const response = await fetch(`https://kx363cbbjsedcxmoltty6jxarq0eptng.lambda-url.us-west-1.on.aws/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(bodyParams)
    });
    console.log('response', response.status)
    const output = await response.json();
    console.log(output)
  }

  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Login', [])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
        <View style={{"backgroundColor": "black", paddingTop: 25}}>
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, fontWeight: "bold"}}>Verify Email</Text>
          <Text style={{color: "white", marginLeft: 20, marginTop: 50, fontSize: 25}}>Email : {email}</Text>
          <Text style={{color: "white", marginTop: 50, marginLeft: 20, fontSize: 25}}>Confirmation Code</Text>
          <View style={{flexDirection: "row",  marginTop: 10, marginLeft: 20, height: 45, }}>
            <TextInput style={{backgroundColor: "white",fontWeight: "bold", fontSize: 18, width: "80%"}} onChangeText={(e) => {setConfirmationCode(e)}} value={confirmationCode} keyboardType="default" />
          </View>
          <TouchableOpacity
            onPress={() => resendVerification()}
            style={{backgroundColor: "black", width: "90%",height: 40, fontSize: 24, marginTop: 90, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "white"}}>Resend Verification</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}
            onPress={() => confirmUser()}>
            <Text style={{fontSize: 25, fontWeight: "bold"}}>Verify</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default VerifyEmail;

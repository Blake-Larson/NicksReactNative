import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import EncryptedStorage from 'react-native-encrypted-storage';
import apiMiddleware from '../backend/apiMiddleware.js';

const VerifyEmail = ({navigation, route, setValidLogin}) => {

  console.log('navigation', navigation)
  console.log('route', route.params);

  const email = route.params[0]['email'];
  const password = route.params[0]['password'];
  const [confirmationCode, setConfirmationCode] = useState([]);
  const [loadingGif, setLoadingGif] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  const confirmUser = async () => {

    setInvalidCode(false);

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
    if (response.status == '500')
    if (response.status != '200')
    {
      setInvalidCode(true);
      return;
    }
    login();
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

  const login = async () => {

    setLoadingGif(true);
    const apiName = `https://go4d787t6h.execute-api.us-west-1.amazonaws.com/dev/hw_signIn`;
    const apiParams = {};
    apiParams['password'] = password;
    apiParams['username'] = email;

    const response = await fetch(apiName, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      credentials: 'same-origin',
      body: JSON.stringify(apiParams)
    });
    const output = await response.json();

    if (output && output.err && output.err.code && output.err.code == 'UserNotConfirmedException')
    {
      console.log('error ???????')
      resendVerification();
      const params = {};
      params['email'] = email;
      params['password'] = password;

      navigation.navigate('VerifyEmail', [params]);
    }

    if (response.status == 500) return setLoadingGif(false);
    console.log('past error');
    console.log('OUTPUT', output)
    await EncryptedStorage.setItem("HW_ACCESS_TOKEN", output.result.accessToken.jwtToken);
    await EncryptedStorage.setItem("HW_REFRESH_TOKEN", output.result.refreshToken.token);

    const metadataApi = `https://cizuaaja9g.execute-api.us-west-1.amazonaws.com/dev/hw_getUserMetaData`;
    const metadataApiParams = {};
    metadataApiParams['email'] = email;

    const metadataResponse = await apiMiddleware(metadataApi, metadataApiParams, setValidLogin);
    const metadata = await metadataResponse.json();

    await EncryptedStorage.setItem("USER_METADATA", JSON.stringify(metadata));
    setLoadingGif(false);
    if (response.status == '200') setValidLogin(true);
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
          {
            loadingGif == false ?
            <TouchableOpacity
              style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}
              onPress={() => confirmUser()}>
              <Text style={{fontSize: 25, fontWeight: "bold"}}>Verify</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
              <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/loading.gif")}></ImageBackground>
            </TouchableOpacity>
          }
          {
            invalidCode == true &&
            <Text style={{color: "red", fontSize: 20, marginTop: 10, textAlign: "center"}}>Error Invalid Code</Text>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default VerifyEmail;

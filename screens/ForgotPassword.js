import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import apiMiddleware from '../backend/apiMiddleware.js';

const ForgotPassword = ({navigation, route, setValidLogin}) => {

  const [email, setEmail] = useState([]);
  const [code, setCode] = useState([]);
  const [codeSent, setCodeSent] = useState(false);
  const [password, setPassword] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);
  const [loadingResetGif, setLoadingResetGif] = useState(false);

  const forgotPassword = async () => {

    setCodeSent(true);
    //https://xlqfuk5e36krreqqmxi4funmym0bxrql.lambda-url.us-west-1.on.aws/
    const api = `https://xlqfuk5e36krreqqmxi4funmym0bxrql.lambda-url.us-west-1.on.aws/`;
    const apiParams = {};
    apiParams['username'] = email;

    const response = await apiMiddleware(api, apiParams, setValidLogin, true);
    const output = await response.json();
    console.log('output');
    console.log(output);

  }
  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('SignIn', [])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
        <View style={{"backgroundColor": "black", paddingTop: 25, paddingBottom: 75}}>
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, fontWeight: "bold"}}>Forgot Password</Text>
          <Text style={{color: "white", marginLeft: 20, marginTop: 50, fontSize: 25}}>Email</Text>
          <TextInput style={{backgroundColor: "white",  marginLeft: 20, marginTop: 10, height: 45, fontWeight: "bold", fontSize: 18, width: "90%"}} onChangeText={(e) => {setEmail(e)}} value={email} keyboardType="default" />
          {
            codeSent == false ?
              <TouchableOpacity onPress={() => forgotPassword()} style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: 25, fontWeight: "bold"}}>Send Code</Text>
              </TouchableOpacity>
              :
              <View>
                <Text style={{color: "green", marginLeft: 20, marginTop: 20, fontSize: 25}}>Email Sent</Text>
                <Text style={{color: "white", marginLeft: 20, marginTop: 25, fontSize: 25}}>Code</Text>
                <TextInput style={{backgroundColor: "white",  marginLeft: 20, marginTop: 10, height: 45, fontWeight: "bold", fontSize: 18, width: "90%"}} onChangeText={(e) => {setCode(e)}} value={code} keyboardType="default" />
                <Text style={{color: "white", marginTop: 50, marginLeft: 20, fontSize: 25}}>New Password</Text>
                <View style={{flexDirection: "row",  marginTop: 10, marginLeft: 20, height: 45, }}>
                  <TextInput secureTextEntry={hidePassword} style={{backgroundColor: "white",fontWeight: "bold", fontSize: 18, width: "80%"}} onChangeText={(e) => {setPassword(e)}} value={password}  keyboardType="default" />
                  <TouchableOpacity style={{width: "10%", backgroundColor: "white",  verticalAlign: "center"}} onPress={() => setHidePassword(!hidePassword)}>
                  {
                    hidePassword == true ? <ImageBackground style={{color: "red", height: 25, width: 25, marginTop: 5}} source={require("../media/hidepassword.png")} /> :
                    <ImageBackground style={{color: "white", height: 25, width: 25, verticalAlign: "center", marginTop: 5}} source={require("../media/showpassword.png")} />
                  }
                  </TouchableOpacity>
                </View>
                {
                  loadingResetGif == false ?
                  <TouchableOpacity onPress={() => login()} style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize: 25, fontWeight: "bold"}}>Reset Password</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
                    <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/loading.gif")}></ImageBackground>
                  </TouchableOpacity>
                }
              </View>
            }

        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default ForgotPassword;

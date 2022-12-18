import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMiddleware from '../backend/apiMiddleware.js';

const SignIn = ({navigation, route, setValidLogin}) => {

  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);

  const login = async () => {

    const api = `https://go4d787t6h.execute-api.us-west-1.amazonaws.com/dev/hw_signIn`;
    const apiParams = {};
    apiParams['password'] = password;
    apiParams['username'] = email;

    const response = await apiMiddleware(api, apiParams, setValidLogin);
    const output = await response.json();

    await AsyncStorage.setItem("HW_ACCESS_TOKEN", output.accessToken.jwtToken);
    await AsyncStorage.setItem("HW_REFRESH_TOKEN", output.refreshToken.token);

    const metadataApi = `https://cizuaaja9g.execute-api.us-west-1.amazonaws.com/dev/hw_getUserMetaData`;
    const metadataApiParams = {};
    metadataApiParams['email'] = email;

    const metadataResponse = await apiMiddleware(metadataApi, metadataApiParams, setValidLogin);
    const metadata = await metadataResponse.json();

    await AsyncStorage.setItem("USER_METADATA", JSON.stringify(metadata));
    setValidLogin(true);
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
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, fontWeight: "bold"}}>Sign In</Text>
          <Text style={{color: "white", marginLeft: 20, marginTop: 50, fontSize: 25}}>Email</Text>
          <TextInput style={{backgroundColor: "white",  marginLeft: 20, marginTop: 10, height: 45, fontWeight: "bold", fontSize: 18, width: "90%"}} onChangeText={(e) => {setEmail(e)}} value={email} keyboardType="default" />
          <Text style={{color: "white", marginTop: 50, marginLeft: 20, fontSize: 25}}>Password</Text>
          <View style={{flexDirection: "row",  marginTop: 10, marginLeft: 20, height: 45, }}>
            <TextInput secureTextEntry={hidePassword} style={{backgroundColor: "white",fontWeight: "bold", fontSize: 18, width: "80%"}} onChangeText={(e) => {setPassword(e)}} value={password}  keyboardType="default" />
            <TouchableOpacity style={{width: "10%", backgroundColor: "white",  verticalAlign: "center"}} onPress={() => setHidePassword(!hidePassword)}>
              {
                hidePassword == true ? <ImageBackground style={{color: "red", height: 25, width: 25, marginTop: 5}} source={require("../media/hidepassword.png")} /> :
                <ImageBackground style={{color: "white", height: 25, width: 25, verticalAlign: "center", marginTop: 5}} source={require("../media/showpassword.png")} />
              }
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{backgroundColor: "black", width: "90%",height: 40, fontSize: 24, marginTop: 90, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "white"}}>Forgot Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => login()} style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 25, fontWeight: "bold"}}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default SignIn;

import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const Login = ({navigation}) => {

  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <View style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <View style={{"backgroundColor": "black", paddingTop: 25}}>
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, fontWeight: "bold"}}>Haute Wellness</Text>
        </View>
        <View style={{bottom: 60, flex: 1,width: ScreenWidth, position: "absolute"}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp', [])}
            style={{backgroundColor: "red", borderRadius: 25, width: "90%",height: 60, fontSize: 24, marginTop: 90, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "white", fontSize: 25, fontWeight: "bold"}}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn', [])}
            style={{backgroundColor: "white", borderRadius: 25, width: "90%", height: 60, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 25, fontWeight: "bold"}}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
};

export default Login;

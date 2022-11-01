import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Linking, SafeAreaView, StatusBar, ScrollView,
  ScreenWidth, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


const Settings = ({setValidLogin, navigation}) => {

  const logOut = () => {

    AsyncStorage.setItem("REFRESH_TOKEN", "");
    setValidLogin(false);
  };

  const logoutAlert = () => {
    Alert.alert(
      "Are you sure you want to logout?",
      "",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logOut() }
      ]
    );
  }

  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}} >
        <View style={{flexDirection: 'row', width: ScreenWidth, paddingTop: 25}}>
          <Text style={{fontWeight: "bold", fontFamily: "System", fontSize: 35, paddingLeft: 25, color: "white", paddingBottom: 15}}>Haute Wellness</Text>
          <Image style={{height: 50, width: 50, marginLeft: 20}} source={require('../media/hwlogo.png')}/>
        </View>
        <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 50, marginLeft: 10, marginRight: 10 }} onPress={() => navigation.navigate('Profile', [])} >
          <Text style={{color: "white", paddingTop: 10, paddingLeft: 10, fontWeight: "bold", fontSize: 22, marginLeft: 10, marginRight: 10}}> Profile </Text>
          <ImageBackground style={{color: "white", height: 40, width: 40, right: 0, marginTop: 5, marginRight: 20, position: "absolute"}} source={require("../media/chevronarrow.png")}></ImageBackground>
        </Pressable>
        <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 20, marginLeft: 10, marginRight: 10}} onPress={() => navigation.navigate('AccountDetails', [])} >
          <Text style={{color: "white", paddingTop: 10, paddingLeft: 10, fontWeight: "bold", fontSize: 22}}> Account Details </Text>
          <ImageBackground style={{color: "white", height: 40, width: 40, right: 0, marginTop: 5, marginRight: 20, position: "absolute"}} source={require("../media/chevronarrow.png")}></ImageBackground>
        </Pressable>
        <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 20, marginLeft: 10, marginRight: 10}} onPress={() => { Linking.openURL('app-settings://notification/')}} >
          <Text style={{color: "white", paddingTop: 10, paddingLeft: 10, fontWeight: "bold", fontSize: 22}}> Notifications </Text>
          <ImageBackground style={{color: "white", height: 40, width: 40, right: 0, marginTop: 5, marginRight: 20, position: "absolute"}} source={require("../media/chevronarrow.png")}></ImageBackground>
        </Pressable>
        <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 20, marginLeft: 10, marginRight: 10}} onPress={() => navigation.navigate('SettingsHelp', [])} >
          <Text style={{color: "white", paddingTop: 10, paddingLeft: 10, fontWeight: "bold", fontSize: 22}}> Help </Text>
          <ImageBackground style={{color: "white", height: 40, width: 40, right: 0, marginTop: 5, marginRight: 20, position: "absolute"}} source={require("../media/chevronarrow.png")}></ImageBackground>
        </Pressable>
        <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 20, marginLeft: 10, marginRight: 10}} onPress={() => { logoutAlert() }} >
          <Text style={{color: "white", paddingTop: 10, paddingLeft: 10, fontWeight: "bold", fontSize: 22}}> Logout </Text>
          <ImageBackground style={{color: "white", height: 40, width: 40, right: 0, marginTop: 5, marginRight: 20, position: "absolute"}} source={require("../media/chevronarrow.png")}></ImageBackground>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
};

export default Settings;

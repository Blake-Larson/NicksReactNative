import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image } from 'react-native';
//import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({setValidLogin}) => {

  const LogOut = () => {

    AsyncStorage.setItem("REFRESH_TOKEN", "");
    setValidLogin(false);
  };
  
  return (
    <View>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Text>        SETTINGS</Text>
      <Image source={{uri: "https://fitappmedia1.s3.us-west-1.amazonaws.com/weights.jpeg"}} style={{ width: 100, height: 100 }}/>
      <Button onPress={LogOut} title="Log Out"/>
    </View>
  )
};

export default Settings;

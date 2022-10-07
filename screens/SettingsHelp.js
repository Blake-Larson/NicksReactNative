import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const SettingsHelp = ({navigation}) => {

  return (
    <View style={{"backgroundColor": "black", "height": 10000}}>
      <View style={{flexDirection: "row", position:'absolute',top:45}}>
          <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
            <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
          </TouchableOpacity>
      </View>
      <Text style={{"color": "white", marginLeft: 20, top:105, fontWeight: "bold", fontSize: 35}}>Help</Text>
      <Text style={{"color": "white", marginLeft: 40, top:205, fontSize: 18}}>TBD: Add Help Feature</Text>
    </View>
  )
};

export default SettingsHelp;

import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';

const SettingsHelp = ({navigation}) => {

  return (
    <SafeAreaView
      style={{flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ECF0F1',
        backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")} />
        </TouchableOpacity>
        <ScrollView style={{ marginTop: 0, flex: 1, paddingBottom: 10, backgroundColor: "black"}}>
          <Text style={{"color": "white", marginLeft: 20, paddingTop: 15, fontWeight: "bold", fontSize: 35}}>Help</Text>
          <Text style={{"color": "white", marginLeft: 40, paddingTop: 55, fontSize: 18}}>TBD: Add Help Feature</Text>
        </ScrollView>
    </SafeAreaView>
  )
};

export default SettingsHelp;

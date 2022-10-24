import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image, Alert, FlatList, Pressable, ScrollView } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Paywall from '../components/Paywall.js';

const AccountDetails = ({navigation, subInfo, setSubInfo, paywallShown, setPaywallShown}) => {

  const [offer, setOffer] = useState(null);
  const [store, setStore] = useState([]);
  const [proInfo, setProInfo] = useState([]);
  const [expirationDate, setExpirationDate] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  return (
    <View style={{"backgroundColor": "black", "height": 1000}}>
      <View style={{flexDirection: "row", position:'absolute',top:45}}>
          <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
            <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
          </TouchableOpacity>
      </View>
      <ScrollView style={{top:85, "height": 1000}}>
        <View style={{backgroundColor: "grey", borderRadius: 22}}>
          <Paywall subInfo={subInfo} setSubInfo={setSubInfo} setPaywallShown={setPaywallShown} />
        </View>
      </ScrollView>
    </View>
  )
};

export default AccountDetails;

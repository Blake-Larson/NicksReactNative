import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Paywall from '../components/Paywall.js';

const AccountDetails = ({navigation, subInfo, setSubInfo, paywallShown, setPaywallShown}) => {

  const [offer, setOffer] = useState(null);
  const [store, setStore] = useState([]);
  const [proInfo, setProInfo] = useState([]);
  const [expirationDate, setExpirationDate] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
        <View style={{backgroundColor: "grey", borderRadius: 22}}>
          <Paywall subInfo={subInfo} setSubInfo={setSubInfo} setPaywallShown={setPaywallShown} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default AccountDetails;

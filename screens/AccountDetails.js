import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image, Alert, FlatList, Pressable, ScrollView } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
// import RNIap from 'react-native-iap'; //'expo-in-app-purchases' //
//import * as InAppPurchases from 'expo-in-app-purchases';
import Purchases from 'react-native-purchases';
import PackageItem from '../components/PackageItem.js';
const moment = require('moment');

const AccountDetails = ({navigation, subInfo, paywallShown, setPaywallShown}) => {

  const [offer, setOffer] = useState(null);
  const [store, setStore] = useState([]);
  const [proInfo, setProInfo] = useState([]);
  const [expirationDate, setExpirationDate] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const fetchOfferings = async () => {
    try {

      const offerings = await Purchases.getOfferings();
      console.log('offerings', offerings)
      if (offerings.current != null) setOffer(offerings.current);
      return;
    } catch (e) {
      console.log(e)
    }
  }

  const defineProInfo = async () => {
    if (subInfo.entitlements.active.pro) setProInfo(subInfo.entitlements.active.pro);
    if (subInfo.entitlements.active.pro) setExpirationDate(moment(subInfo.entitlements.active.pro.expirationDate).format('lll'));
  }

  const buyPackage = async (pack) => {

    try {
      setIsPurchasing(true);
      const {purchaserInfo, productIdentifier} =
        await Purchases.purchaseProduct("HWTEST3");
        setPaywallShown(false);
        setIsPurchasing(false);

    } catch (e) {
      setIsPurchasing(false);
      if (!e.userCancelled) {
        console.log('....', e);
      }
    }
  }

  useEffect(() => {
    fetchOfferings();
    defineProInfo();
    return () => {};
  }, [subInfo]);


  return (
    <View style={{"backgroundColor": "black", "height": 1000}}>
      <View style={{flexDirection: "row", position:'absolute',top:45}}>
          <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
            <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
          </TouchableOpacity>
      </View>
      <ScrollView style={{top:85, "height": 1000}}>
      <Text style={{color:"white", fontSize: 25}}>isPurchasing: {JSON.stringify(isPurchasing)} </Text>
        { offer && (proInfo.length == 0 || proInfo.isActive == false) && (
          offer.availablePackages.map(pack => (
            <View style={{backgroundColor: "blue"}} key={pack.identifier}>
              <Text style={{color: "white"}}>
                <Text style={{color: "white"}}>PACK: {pack.product.priceString} / month</Text>{' '}
                after trial ends.
              </Text>
              <Pressable style={{backgroundColor: "orange", height: 45, width: 45, marginLeft: 35, borderRadius: 10}} onPress={() => buyPackage(pack)}>
                <Text style={{fontSize: 22, fontWeight: "bold"}}>Buy</Text>
              </Pressable>
            </View>
          ))
        )}
        <View style={{margin: 25}}>
          {subInfo && subInfo.allPurchasedProductIdentifiers && subInfo.allPurchasedProductIdentifiers.length == 0 && <Text style={{color:"green", fontSize: 25}}>Free trial Available!</Text>}
          {subInfo && subInfo.allPurchasedProductIdentifiers && subInfo.allPurchasedProductIdentifiers.length > 0 && proInfo.isActive == false && <Text style={{color:"red", fontSize: 25}}>Free trial used</Text>}
          <Text style={{color:"white", fontSize: 25}}>{JSON.stringify(subInfo.allPurchasedProductIdentifiers)}</Text>
          <Text style={{color: proInfo.isActive == true ? "green" : "red", fontSize: 25}}>{proInfo.isActive == true ? "active" : "in-active"}</Text>
          {
            proInfo.isActive == true &&
            <View>
              <Text style={{color:"white", fontSize: 25}}>Store: {proInfo.periodType} </Text>
              <Text style={{color:"white", fontSize: 20}}>Expiration Date: {expirationDate} and {proInfo.willRenew == true ? "will renew" : "will not renew"}</Text>
            </View>
          }
        </View>
        <Text style={{color:"white"}}> {JSON.stringify(proInfo)}</Text>
        <Text style={{color:"white"}}>{'\n'}========={'\n'}</Text>

        <Text style={{color:"white"}}> {JSON.stringify(subInfo)}</Text>
        </ScrollView>
    </View>
  )
};

export default AccountDetails;

/*
{ all:
   { pro:
      { originalPurchaseDate: '2022-10-14T16:30:13Z',
        originalPurchaseDateMillis: 1665765013000,
        willRenew: true,
        ownershipType: 'PURCHASED',
        unsubscribedDetectedAtMillis: null,
        latestPurchaseDate: '2022-10-17T14:15:01Z',
        expirationDate: '2022-10-17T14:17:01Z',
        billingIssueDetectedAtMillis: null,
        unsubscribedDetectedAt: null,
        latestPurchaseDateMillis: 1666016101000,
        isSandbox: true,
        productIdentifier: 'HWTEST3',
        billingIssueDetectedAt: null,
        store: 'APP_STORE',
        isActive: true,
        periodType: 'TRIAL',
        identifier: 'pro',
        expirationDateMillis: 1666016221000 } },
  active:
   { pro:
      { unsubscribedDetectedAtMillis: null,
        latestPurchaseDate: '2022-10-17T14:15:01Z',
        isSandbox: true,
        latestPurchaseDateMillis: 1666016101000,
        expirationDate: '2022-10-17T14:17:01Z',
        billingIssueDetectedAt: null,
        expirationDateMillis: 1666016221000,
        billingIssueDetectedAtMillis: null,
        unsubscribedDetectedAt: null,
        productIdentifier: 'HWTEST3',
        periodType: 'TRIAL',
        identifier: 'pro',
        store: 'APP_STORE',
        isActive: true,
        originalPurchaseDate: '2022-10-14T16:30:13Z',
        ownershipType: 'PURCHASED',
        willRenew: true,
        originalPurchaseDateMillis: 1665765013000 } } }*/

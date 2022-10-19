import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
const moment = require('moment')
const ENTITLEMENT_ID = "pro";

const Paywall = ({subInfo, paywallShown, setPaywallShown}) => {

  console.log('subInfo', subInfo)
  const [offer, setOffer] = useState(null);
  const [customerInfo, setCustomerInfo] = useState([]);
  const [store, setStore] = useState([]);
  const [proInfo, setProInfo] = useState([]);
  const [expirationDate, setExpirationDate] = useState([]);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  //useState(moment(customerInfo.entitlements.active.pro.expirationDate).format('lll'));

/*
  setProInfo(customerInfo.entitlements.active.pro)
  setStore(customerInfo.entitlements.active.pro.store);
  console.log('date',date)
  setExpirationDate(date)
  */
  console.log('subInfo')
  console.log(subInfo.entitlements)

  useEffect(() => {
    //setProInfo(subInfo.entitlements.active.pro)
    fetchOfferings();
    return () => {};
  }, []);

/*
  const onSelection = async () => {

    try {
      const { purchaserInfo } = await Purchases.purchasePackage(purchasePackage);

    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Error purchasing package', e.message);
      }
    } finally {
    }
  };
&*/
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

  const buyPackage = async (pack) => {

    try {
      console.log('buying....')
      setIsPurchasing(true);
      const outputResult = await Purchases.purchaseProduct("HWTEST3");
      console.log('outputResult after buy', outputResult)
      console.log('done....')
      setPurchaseComplete(true);
      setPaywallShown(false);
      setIsPurchasing(false);

      console.log('good')
    } catch (e) {
      setIsPurchasing(false);
      if (!e.userCancelled) {
        console.log('....', e);
      }
    }
  }

  return (
      <View style={{margin: 25}}>
      {
        purchaseComplete == true ? <Text style={{fontSize: 30, fontWeight: "bold"}}>Purchase Complete!</Text> :
        <ScrollView>
          {subInfo && subInfo.allPurchasedProductIdentifiers && subInfo.allPurchasedProductIdentifiers.length == 0 && <Text style={{color:"black", fontWeight: "bold", padding: 15, fontSize: 20, fontWeight: "bold"}}>Cancel Anytime 7-Day Free Trial!</Text>}
          {subInfo && subInfo.allPurchasedProductIdentifiers && subInfo.allPurchasedProductIdentifiers.length > 0 && <Text style={{color:"black", fontWeight: "bold", padding: 15, fontSize: 20, fontWeight: "bold"}}>UPGRADE{'   '}Trial Is Expired</Text>}

          {subInfo && subInfo.allPurchasedProductIdentifiers && subInfo.allPurchasedProductIdentifiers.length > 0 && <Text style={{color:"red", fontSize: 25}}>Subscription Expired!</Text>}
          {
            !offer ? (
              <View><Text style={{color: "white"}}> NO OFFERS! </Text></View>
            ) :
            (
            offer.availablePackages.map(pack => (
              <View style={{backgroundColor: "white", borderRadius: 22, flex:1,justifyContent: "center",alignItems: "center"}} key={pack.identifier}>
                <Text style={{color: "black", fontSize: 30, fontWeight: "bold", textAlign: "center", paddingTop: 15}}> Haute Wellness Pro</Text>
                <Text style={{color: "black", fontSize: 15, fontWeight: "bold", textAlign: "center", paddingTop: 15}}> Daily workouts scheduled for you {'\n'}</Text>
                {
                  isPurchasing == true &&
                  <View>
                    <Text style={{color: "white"}}>LOADING</Text>
                    <Text style={{color: "white"}}>LOADING</Text>
                    <Text style={{color: "white"}}>LOADING</Text>
                    <Text style={{color: "white"}}>LOADING</Text>
                    <Text style={{color: "white"}}>LOADING</Text>
                    <Text style={{color: "white"}}>LOADING</Text>
                    <Text style={{color: "white"}}>LOADING</Text>
                  </View>
                }
                <Pressable style={{backgroundColor: "#D6B22E", height: 65, width: 235, paddingTop: 15, borderRadius: 20, marginTop: 15}} onPress={() => buyPackage(pack)}>
                  <Text style={{fontSize: 22, fontWeight: "bold", height: 80, textAlignVertical: "center",textAlign: "center"}}>PRO {'   '}{pack.product.priceString}/MO</Text>
                  <Text style={{color: "black", fontSize: 22}}></Text>

                </Pressable>
                <Text style={{fontSize: 22, fontWeight: "bold", color: "white"}}>isPurchasing: {JSON.stringify(isPurchasing)}</Text>
              </View>
            ))
          )}
          {proInfo.pro &&
            <View>
              <Text style={{color:"white", fontSize: 25}}>Store: {proInfo.pro.periodType}      {proInfo.pro.isActive == true ? "active" : "in-active"}</Text>
              <Text style={{color:"white", fontSize: 20}}>Expiration Date: {expirationDate} and {proInfo.pro.willRenew == true ? "will renew" : "will not renew"}</Text>
            </View>
          }
          <Text style={{padding: 15, textAlign: "center"}}>Subscription Terms</Text>
          <Text style={{textAlign: "center"}}>Payments will be charged to your iTunes account at confirmation of purchase. Subscription automatically renews, unless auto-renew
            is turned off at least 24-hours prior to the end of the current period. Account will be charged for renewal within 24-hours prior to the end of the current period
            at the amount specified after the introductory period. You may manage your subscriptions and auto-renewal may be turned off by going to your iTunes Account settings
            after purchase. Any unused portion of a free trial period will be forfeited when subscribing to a non-trial plan.{'\n\n'}
            By continuing you accept our {'\n\n'}
            Privacy Policy and Terms of Service</Text>
      </ScrollView>
    }
    </View>
  );
};


const styles = StyleSheet.create({
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    padding: 30
  }
});

export default Paywall;

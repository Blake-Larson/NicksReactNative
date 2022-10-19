import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
const moment = require('moment')
const ENTITLEMENT_ID = "pro";

const Paywall = ({subInfo, setSubInfo, paywallShown, setPaywallShown}) => {

  const [offer, setOffer] = useState(null);
  const [customerInfo, setCustomerInfo] = useState([]);
  const [proInfo, setProInfo] = useState([]);
  const [expirationDate, setExpirationDate] = useState([]);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const defineProInfo = async () => {

    setProInfo({"isActive": true})
    if (!subInfo || !subInfo.entitlements || !subInfo.entitlements.active) return;
    setProInfo(subInfo.entitlements.active.pro)
  }

  useEffect(() => {
    defineProInfo()
    fetchOfferings();
    return () => {};
  }, [subInfo]);

  const fetchOfferings = async () => {

    try {
      const offerings = await Purchases.getOfferings();
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
      setPurchaseComplete(true);
      setPaywallShown(false);
      setIsPurchasing(false);

    } catch (e) {
      setIsPurchasing(false);
      if (!e.userCancelled) {
        console.log('....', e);
      }
    }
  }

  const restorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();
      console.log('restore', JSON.stringify(restore))
      setSubInfo(restore);
      if (restore && restore.entitlements.active && restore.entitlements.active.pro && restore.entitlements.active.pro.isActive) setPaywallShown(false);

    } catch (e) {

    }
  }

  return (
      <View style={{margin: 25}}>
        <ScrollView>
          {
            subInfo && subInfo.allPurchasedProductIdentifiers && subInfo.allPurchasedProductIdentifiers.length == 0 &&
            <Text style={{color:"black", fontWeight: "bold", padding: 15, fontSize: 20, fontWeight: "bold", textAlign: "center"}}>Cancel Anytime 7-Day Free Trial!</Text>
          }
          {
            subInfo && subInfo.allPurchasedProductIdentifiers && subInfo.allPurchasedProductIdentifiers.length > 0
            && !proInfo &&
              <Text style={{color:"black", fontWeight: "bold", padding: 15, fontSize: 20, textAlign: "center"}}>
                <Text style={{fontSize: 24, fontWeight: "bold"}}>UPGRADE</Text>
                {'   '}Trial Is Expired
              </Text>
          }
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
                  <Text style={{fontSize: 22, fontWeight: "bold", height: 80, textAlignVertical: "center",textAlign: "center"}}>PRO {' '}
                    {proInfo && proInfo.isActive && <Text>Active</Text>}
                    {!proInfo && <Text>{pack.product.priceString}/MO</Text>}
                  </Text>
                  <Text style={{color: "black", fontSize: 22}}></Text>

                </Pressable>
                <Text style={{fontSize: 22, fontWeight: "bold", color: "white"}}>isPurchasing: {JSON.stringify(isPurchasing)}</Text>
              </View>
            ))
          )}
          {proInfo &&
            <View style={{backgroundColor: "black"}}>
              <Text style={{color:"white", fontSize: 25}}>Store: {proInfo.periodType}      {proInfo.isActive == true ? "active" : "in-active"}</Text>
              <Text style={{color:"white", fontSize: 20}}>Expiration Date: {expirationDate} and {proInfo.willRenew == true ? "will renew" : "will not renew"}</Text>
            </View>
          }
          <Pressable onPress={() => restorePurchases()}>
            <Text style={{padding: 15, textAlign: "center", fontSize: 25}}>Restore Purchases</Text>
          </Pressable>
          <Text style={{padding: 10, textAlign: "center"}}>Subscription Terms</Text>
          <Text style={{textAlign: "center"}}>Payments will be charged to your iTunes account at confirmation of purchase. Subscription automatically renews, unless auto-renew
            is turned off at least 24-hours prior to the end of the current period. Account will be charged for renewal within 24-hours prior to the end of the current period
            at the amount specified after the introductory period. You may manage your subscriptions and auto-renewal may be turned off by going to your iTunes Account settings
            after purchase. Any unused portion of a free trial period will be forfeited when subscribing to a non-trial plan.{'\n\n'}
            By continuing you accept our {'\n\n'}
            Privacy Policy and Terms of Service</Text>
      </ScrollView>
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

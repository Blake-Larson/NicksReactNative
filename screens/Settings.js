import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Linking, Modal, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
//import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNIap from 'react-native-iap'; //'expo-in-app-purchases' //

const productIds = ['1MONTH'];
const Settings = ({setValidLogin, navigation}) => {

  const [price, setPrice] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [productId, setProductId] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {

    // WORKS
    /*

    RNIap.initConnection().catch(() => {
      console.log('ERROR connecting to store...')
    }).then(() => {
      console.log('connected to store...')
      RNIap.getSubscriptions(['hw_test']).catch(() => {
        console.log("ERROR FINDING PURCHASES")
      }).then((res) => {
        console.log('got products')
        console.log(res)
        setPrice(res[0]['localizedPrice']);
        setProductId(res[0]['productId']);
        setProducts(res);
        console.log('trying!')

        try {
            RNIap.requestSubscription(res[0]['productId']);
          }
          catch (error) { console.log('error', error)}
      });

    });*/
                /*    LISTENER...
                    const purchaseUpdatedListener = RNIap.purchaseUpdatedListener((purchase) => {
                      try {
                        const receipt = purchase.transactionReceipt;
                        console.log('receipt')
                        console.log(receipt)
                        setPurchase("purchased!")
                      }
                      catch (error) {

                      }
                    })*/
  }, []);

  const logOut = () => {

    AsyncStorage.setItem("REFRESH_TOKEN", "");
    setValidLogin(false);
  };

  const purchaseSub = async (sku, offerToken) => {
    try {
      RNIap.requestSubscription({sku});
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const subPopup = async (sku, offerToken) => {

    if (Platform.OS === 'ios') {
      console.log('clearing..')
      await RNIap.clearTransactionIOS();
    }

    await RNIap.requestSubscription({sku}, sku).catch((error) => {
      console.log(sku)
      console.log('ERROR ', error)
    }).then((result) => {
      console.log('result')
      console.log(sku)
      console.log(result)
    });
  //  await RNIap.clearTransactionIOS();
  }

  const makeSubscription = async (sku) => {
    try {
      RNIap.requestSubscription(sku);
    }
    catch (error) { console.log('error', error)}
  }

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
    <View style={{"backgroundColor": "black", "height": 1000}}>
      <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 120, marginLeft: 10, marginRight: 10 }} onPress={() => navigation.navigate('Profile', [])} >
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
      <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 20, marginLeft: 10, marginRight: 10}} onPress={() => { logoutAlert() }} >
        <Text style={{color: "white", paddingTop: 10, paddingLeft: 10, fontWeight: "bold", fontSize: 22}}> Logout </Text>
        <ImageBackground style={{color: "white", height: 40, width: 40, right: 0, marginTop: 5, marginRight: 20, position: "absolute"}} source={require("../media/chevronarrow.png")}></ImageBackground>
      </Pressable>
    </View>
  )
};

/* WORKS
<View style={{marginTop: 200}}>
  <Button onPress={() => makeSubscription(products[0]["productId"]) } title="Purchase"/>
  <Text style={{"color": "white"}}>Price: {price}</Text>
  <Text style={{"color": "white"}}>{purchase}</Text>
  <Text style={{"color": "white"}}>{JSON.stringify(products)}</Text>
</View>
*/

export default Settings;

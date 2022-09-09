import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image } from 'react-native';
//import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNIap from 'react-native-iap'; //'expo-in-app-purchases' //

const productIds = ['1MONTH'];
const Settings = ({setValidLogin}) => {

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

  const LogOut = () => {

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
      <Image source={{uri: "https://fitappmedia1.s3.us-west-1.amazonaws.com/weights.jpeg"}} style={{ width: 100, height: 100 }}/>
      <Button onPress={() => makeSubscription(products[0]["productId"]) } title="Purchase"/>
      <Button onPress={LogOut} title="Log Out"/>
      <Text>Price: {price}</Text>
      <Text>{purchase}</Text>
      <Text>{JSON.stringify(products)}</Text>

    </View>
  )
};

export default Settings;

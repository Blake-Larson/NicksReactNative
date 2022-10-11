import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import RNIap from 'react-native-iap'; //'expo-in-app-purchases' //

const AccountDetails = ({navigation}) => {


  const productIds = ['1MONTH'];
  const itemSkus = ['1MONTH'];

  const [price, setPrice] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [productId, setProductId] = useState([]);
  const [products, setProducts] = useState([]);

  const [productList, setProductList] = useState([]);
  const getItems = async () => {
     try {
       console.log('itemSkus[0]', itemSkus[0]);
       const products: Product[] = await RNIap.getSubscriptions(itemSkus);
       console.log('Products[0]', products[0]);
       setProductList({productList: products});
       requestSubscription(itemSkus[0]);
     } catch (err) {
       console.log('getItems || purchase error => ', err);
     }
   };
   getSubscriptions = async () => {
     try {
       const products = await RNIap.getSubscriptions(itemSubs);
       console.log('Products => ', products);
       setProductList({productList: products});
     } catch (err) {
       console.log('getSubscriptions error => ', err);
     }
   };
   getAvailablePurchases = async () => {
     try {
       const purchases = await RNIap.getAvailablePurchases();
       console.info('Available purchases => ', purchases);
       if (purchases && purchases.length > 0) {
         this.setState({
           availableItemsMessage: `Got ${purchases.length} items.`,
           receipt: purchases[0].transactionReceipt,
         });
       }
     } catch (err) {
       console.warn(err.code, err.message);
       console.log('getAvailablePurchases error => ', err);
     }
   };
   requestPurchase = async (sku) => {
     console.log('sku')
     console.log(sku)

     try {
       RNIap.requestPurchase(sku);
     } catch (err) {
       console.log('requestPurchase error => ', err);
     }
   };
   requestSubscription = async (sku) => {
     console.log('sku sub')
     console.log(sku)

     try {
      // await this.getItems();
       await RNIap.requestSubscription(sku);
     } catch (err) {
       alert(err.toLocaleString());
     }
   };
   purchaseConfirmed = () => {
     //you can code here for what changes you want to do in db on purchase successfull
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


  useEffect(() => {

    // WORKS


    RNIap.initConnection().catch(() => {
      console.log('ERROR connecting to store...')
    }).then(() => {
      console.log('connected to store...')
      RNIap.getSubscriptions(['1MONTH']).catch(() => {
        console.log("ERROR FINDING PURCHASES")
      }).then((res) => {
        console.log('got products')
        console.log(res)
        setPrice(res[0]['localizedPrice']);
        setProductId(res[0]['productId']);
        setProducts(res);
        console.log('trying!')
        console.log(res[0]['productId'])

        try {
            RNIap.requestSubscription(res[0]['productId']);
          }
          catch (error) { console.log('error', error)}
      });

    });
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

  return (
    <View style={{"backgroundColor": "black", "height": 1000}}>
      <View style={{flexDirection: "row", position:'absolute',top:45}}>
          <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
            <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
          </TouchableOpacity>
      </View>
      <Text style={{"color": "white", marginLeft: 20, top:105, fontWeight: "bold", fontSize: 35}}>Account Details</Text>
      <Text style={{"color": "white", marginLeft: 40, top:205, fontSize: 18}}>Product ID: {productId}</Text>
      <Text style={{"color": "white", marginLeft: 40, top:205, fontSize: 18}}>Price: {price}</Text>
      <TouchableOpacity style={{backgroundColor: "blue",top:235, width: "50%", marginLeft: 25}} onPress={() => makeSubscription(productId)}>
        <Text style={{"color": "white", marginLeft: 40, fontSize: 22}}> Click to Request Subscription</Text>
      </TouchableOpacity>
    </View>
  )
};

export default AccountDetails;

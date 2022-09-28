import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image, TextInput } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = ({navigation}) => {



  const [price, setPrice] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [productId, setProductId] = useState([]);
  const [products, setProducts] = useState([]);
  const [userMetaData, setUserMetaData] = useState([]);
  const [email, setEmail] = useState([]);

  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);
  const [originalFirstName, setOriginalFirstName] = useState([]);
  const [originalLastName, setOriginalLastName] = useState([]);

  useEffect(() => {
    getUserMetaData();
  }, []);

  const getUserMetaData = async () => {

    const test = await AsyncStorage.getItem("USER_METADATA");
    const jsonOutput = JSON.parse(test);
    console.log(jsonOutput[0]);
    setEmail(jsonOutput[0]['email']);
    setFirstName(jsonOutput[0]['firstname']);
    setLastName(jsonOutput[0]['lastname']);
    setOriginalFirstName(jsonOutput[0]['firstname']);
    setOriginalLastName(jsonOutput[0]['lastname']);

    setUserMetaData(test);
  }

  return (
    <View style={{"backgroundColor": "black", "height": 10000}}>
      <View style={{flexDirection: "row", paddingTop: 50}}>
          <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
            <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
          </TouchableOpacity>
      </View>
      <Text style={{"color": "white", marginLeft: 20, fontWeight: "bold", fontSize: 38}}>Profile</Text>
      <View style={{flexDirection: "row", paddingTop: 30}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 30,fontWeight: "bold", fontSize: 18}}>Email</Text>
        <Text style={{"color": "white", marginTop: 30,fontWeight: "bold", fontSize: 15}}>{email}</Text>
      </View>
      <View style={{flexDirection: "row", paddingTop: 10}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 50,fontWeight: "bold", fontSize: 18}}>First Name</Text>
        <TextInput style={{"color": "white", marginTop: 50,fontWeight: "bold", fontSize: 18}} onChangeText={(e) => {setFirstName(e)}} value={firstName} keyboardType="default" />
      </View>
      <View style={{flexDirection: "row", paddingTop: 10}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 50,fontWeight: "bold", fontSize: 18}}>Last Name</Text>
        <TextInput style={{"color": "white", marginTop: 50,fontWeight: "bold", fontSize: 18}} onChangeText={(e) => {setLastName(e)}} value={lastName} keyboardType="default" />
      </View>
      <Text style={{color: "white"}}>{JSON.stringify(userMetaData)}</Text>
      {
         &&
        <Text style={{color: "white", fontSize: 25, paddingTop: 40}}>SAVE !</Text>
      }

    </View>
  )
};

export default Profile;

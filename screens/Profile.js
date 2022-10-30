import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image, TextInput, Pressable } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import AsyncStorage from '@react-native-async-storage/async-storage';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

const Profile = ({navigation}) => {



  const [price, setPrice] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [productId, setProductId] = useState([]);
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState([]);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [originalFirstName, setOriginalFirstName] = useState([]);
  const [originalLastName, setOriginalLastName] = useState([]);

  useEffect(() => {
    getUserMetaData();
  }, []);

  const getUserMetaData = async () => {

    const user_metadata = await AsyncStorage.getItem("USER_METADATA");
    const jsonOutput = JSON.parse(user_metadata);

    setEmail(jsonOutput[0]['email']);
    setFirstName(jsonOutput[0]['firstname']);
    setLastName(jsonOutput[0]['lastname']);
    setOriginalFirstName(jsonOutput[0]['firstname']);
    setOriginalLastName(jsonOutput[0]['lastname']);
  }

  const saveUserMetaData = async () => {

    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    const sub = await AsyncStorage.getItem("APPLE_SUB");

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', storageToken);

    const userParams = {};
    userParams['apple_sub'] = sub;
    userParams['id_token'] = storageToken;
    userParams['firstname'] = firstName;
    userParams['lastname'] = lastName;

    const userResponse = await fetch(`https://hautewellnessapp.com/api/saveUserMetaData`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(userParams)
    });

    const userMetaData = await AsyncStorage.getItem("USER_METADATA");
    const json_userMetaData = JSON.parse(userMetaData);

    json_userMetaData[0]['firstname'] = firstName;
    json_userMetaData[0]['lastname'] = lastName;
    AsyncStorage.setItem("USER_METADATA", JSON.stringify(json_userMetaData));

    setOriginalLastName(lastName);
    setOriginalFirstName(firstName);
  }

  //
  const revokeAccount = async () => {

    const appleClientSecret = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjlXUFNON1k3SDgifQ.eyJpc3MiOiJaWkNIQjU5RDI3IiwiaWF0IjoxNjY3MDk2Njk1LCJleHAiOjE2NjcxMDg2OTUsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJvcmcucmVhY3Rqcy5uYXRpdmUuZXhhbXBsZS5IYXV0ZVdlbGxuZXNzIn0.X4c4_ki0ndI7yj4GenWvswCUofhr73Q87pXMY06RnoVKTTi6Q7YCSP36tKOCl0lYLgg2DEPfGTm524P8pjiOww'
    try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log('res', appleAuthRequestResponse)
    const {authorizationCode} = appleAuthRequestResponse;
    if (!authorizationCode) {
      console.log('Authorization code not found after signin');
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    try {
      const authTokenBody = new URLSearchParams({
        client_id: 'com.example.app',
        client_secret: appleClientSecret,
        code: authorizationCode,
        grant_type: 'authorization_code',
      });
      const generateAuthTokenUrl = 'https://appleid.apple.com/auth/token';
      /*

      const authTokenResponse = await axios.post(
        generateAuthTokenUrl,
        authTokenBody,
        config,
      );
      */
      const output = await fetch(generateAuthTokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'same-origin',
        body: authTokenBody
      });
      const authTokenResponse = await output.json();
      console.log('authTokenResponse', authTokenResponse.data)
/*
      if (!authTokenResponse.data.refresh_token) {
        console.log('No refresh token data');
      }
      const revokeTokenBody = new URLSearchParams({
        client_id: 'com.example.app',
        client_secret: appleClientSecret,
        token: authTokenResponse.data.refresh_token,
        token_type_hint: 'refresh_token',
      });
      const revokeAuthTokenUrl = 'https://appleid.apple.com/auth/revoke';
      await axios.post(revokeAuthTokenUrl, revokeTokenBody, config);
      */
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error("e", e);
  }
  }

  const Save = () => {

    if (originalLastName != lastName) return (
      <TouchableOpacity style={{fontSize: 15, width: 80, height: 50, fontWeight: "bold", right: 30, position: "absolute"}} onPress={() => {saveUserMetaData()}}>
        <Text style={{color: "white", fontSize: 28}}> Save </Text>
      </TouchableOpacity>
    );
    if (originalFirstName != firstName)return (
      <TouchableOpacity style={{fontSize: 15, width: 80, height: 50, fontWeight: "bold", right: 30, position: "absolute"}} onPress={() => {saveUserMetaData()}}>
        <Text style={{color: "white", fontSize: 28}}> Save </Text>
      </TouchableOpacity>
    );
    return (<View />);
  }

  return (
    <View style={{"backgroundColor": "black", "height": 1000}}>
      <View style={{flexDirection: "row", paddingTop: 50}}>
          <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Settings', [])}>
            <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
          </TouchableOpacity>
      </View>
      <View style={{flexDirection: "row", paddingTop: 50}}>
        <Text style={{color: "white", marginLeft: 20, fontWeight: "bold", fontSize: 38, position: "absolute", left: 0}}>Profile</Text>
        <Save />
      </View>
      <View style={{flexDirection: "row", paddingTop: 30}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 30,fontWeight: "bold", fontSize: 18}}>Email</Text>
        <Text style={{"color": "white", marginTop: 30,fontWeight: "bold", fontSize: 15}}>{email}</Text>
      </View>
      <View style={{flexDirection: "row", paddingTop: 10}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 50,fontWeight: "bold", fontSize: 18}}>First Name</Text>
        <TextInput style={{"color": "white", marginTop: 50,fontWeight: "bold", fontSize: 18, width: 230}} onChangeText={(e) => {setFirstName(e)}} value={firstName} keyboardType="default" />
      </View>
      <View style={{flexDirection: "row", paddingTop: 10}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 50,fontWeight: "bold", fontSize: 18}}>Last Name</Text>
        <TextInput style={{"color": "white", marginTop: 50,fontWeight: "bold", fontSize: 18, width: 230}} onChangeText={(e) => {setLastName(e)}} value={lastName} keyboardType="default" />
      </View>
      <Button title="REMOVE" onPress={() => {revokeAccount()}} />
    </View>
  )
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image, StyleSheet, TextInput, Modal, Pressable } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import AsyncStorage from '@react-native-async-storage/async-storage';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

const Profile = ({setValidLogin, navigation}) => {

  const [price, setPrice] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [productId, setProductId] = useState([]);
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

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

  const revokeAccount = async () => {

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log('appleAuthRequestResponse:', appleAuthRequestResponse);
    const {authorizationCode, identityToken, nonce, user} = appleAuthRequestResponse;
    if (!authorizationCode) console.log('Authorization code not found after signin');
    console.log(authorizationCode)
    console.log(identityToken)
    console.log(nonce)
    console.log(user)

    const userParams = {};
    userParams['apple_sub'] = user;
    userParams['id_token'] = identityToken;
    userParams['nonce'] = nonce;
    userParams['authorization_code'] = authorizationCode;
    console.log(userParams);

    AsyncStorage.setItem("REFRESH_TOKEN", "");
    setValidLogin(false);
/*
    const userResponse = await fetch(`https://hautewellnessapp.com/api/revokeAppleToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(userParams)
    });

    const ouptut = await userResponse.json();
*/
  //  console.log('userResponse', ouptut);

  }
/*
  const deleteAlert = () => {
    Alert.alert(
      "Are you sure?",
      "Account deletion cannot be undone",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => revokeAccount() }
      ]
    );
  }
*/
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
        <Text style={{"color": "white", marginTop: 30, fontWeight: "bold", fontSize: 15}}>{email}</Text>
      </View>
      <View style={{flexDirection: "row", paddingTop: 10}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 50,fontWeight: "bold", fontSize: 18}}>First Name</Text>
        <TextInput style={{"color": "white", marginTop: 50, fontWeight: "bold", fontSize: 18, width: 230}} onChangeText={(e) => {setFirstName(e)}} value={firstName} keyboardType="default" />
      </View>
      <View style={{flexDirection: "row", paddingTop: 10}}>
        <Text style={{"color": "white", width: ScreenWidth / 3, marginLeft: 20, marginTop: 50,fontWeight: "bold", fontSize: 18}}>Last Name</Text>
        <TextInput style={{"color": "white", marginTop: 50, fontWeight: "bold", fontSize: 18, width: 230}} onChangeText={(e) => {setLastName(e)}} value={lastName} keyboardType="default" />
      </View>
      <Pressable style={{marginLeft: 20, marginTop: 200}} onPress={() => {setDeleteModal(true)}}>
        <Text style={{fontSize: 18, color: "white", padding: 5}}>Delete Account</Text>
      </Pressable>
      <Modal
        transparent={true}
        animationType="slide"
        visible={deleteModal}
        onRequestClose={() => { setDeleteModal(!deleteModal) }}>
          <View style={styles.apnModalContainer} onPress={() => {setDeleteModal(false)}}>
            <Pressable style={styles.apnModalContainer} onPress={() => {setDeleteModal(false);}}>
               <View style={styles.deleteModalView}>
               <Text style={{color: "white", fontSize: 28, fontWeight: "bold", textAlign: "center"}}>Are you sure?</Text>
               <Text style={{color: "white", fontSize: 18, textAlign: "center", paddingTop: 10}}>Account deletion cannot be undone</Text>
               <Text style={{color: "white", fontSize: 15, textAlign: "center", marginTop: 20, padding: 15}}>Warning: if you have auto-renewable subscriptions, your billling will continue through Apple. Please cancel your subscription before continuing with deleting your account</Text>
                <View style={{flexDirection: "row"}}>
                 <TouchableOpacity style={styles.deleteModal} onPress={() => {setDeleteModal(false)}}>
                    <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>Cancel</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.deleteModal} onPress={() => {revokeAccount(); setDeleteModal(false)}}>
                    <Text style={{color: "red", fontSize: 18, fontWeight: "bold"}}>Delete</Text>
                 </TouchableOpacity>
               </View>
              </View>
            </Pressable>
         </View>
       </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  apnModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowOpacity: 0.25,
  },
  deleteModalView: {
    margin: 20,
    backgroundColor: "#2F2D2D",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  deleteModal: {
    alignItems: 'center',
    backgroundColor: "black",
    height: 50,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
    width: 135,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    marginBottom: 4,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    marginTop: 30,
  },
});

export default Profile;

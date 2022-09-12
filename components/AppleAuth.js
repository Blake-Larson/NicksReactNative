import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

const AppleAuth = ({setValidLogin}) => {

  async function onAppleButtonPress() {

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log('appleAuthRequestResponse')
    console.log(appleAuthRequestResponse)
    const { email, email_verified, is_private_email, sub } = jwt_decode(appleAuthRequestResponse.identityToken)
    /*
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    console.log('credentialState')
    console.log(credentialState)
    */
    console.log('email', email)
    console.log('family name', appleAuthRequestResponse.fullName.familyName);
    console.log('given name', appleAuthRequestResponse.fullName.givenName);
    console.log('sub', sub);


    let lastname = null;
    if (appleAuthRequestResponse.fullName) lastname = appleAuthRequestResponse.fullName.familyName;
    let firstname = null;
    if (appleAuthRequestResponse.fullName) firstname = appleAuthRequestResponse.fullName.givenName;

    if (!appleAuthRequestResponse.identityToken) console.log('Apple Sign-In failed - no identify token returned');
    //console.log(JSON.stringify({"id_token": appleAuthRequestResponse.identityToken, "username": email}))

    const response = await fetch(`https://hautewellnessapp.com/apple/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({"id_token": appleAuthRequestResponse.identityToken })
    })
    console.log('response ***** -------');
    console.log(response.status)
    if (response.status != "200" && response.status != "201" && response.status != "203" && response.status != "204" )
    {
      console.log('login error')
      setLoginError(true);
      setLoginLoading(false);
      return;
    }

    console.log('token', appleAuthRequestResponse.identityToken)
    await AsyncStorage.setItem("REFRESH_TOKEN", appleAuthRequestResponse.identityToken);
    await AsyncStorage.setItem("APPLE_SUB", sub);

    const userParams = {};
    userParams['firstname'] = firstname;
    userParams['lastname'] = lastname;
    userParams['email'] = email;
    userParams['apple_sub'] = sub;
    userParams['id_token'] = appleAuthRequestResponse.identityToken;

    console.log('userParams', userParams);
    const userResponse = await fetch(`https://hautewellnessapp.com/api/user_metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(userParams)
      });

    console.log('userResponse', userResponse.status)
    if (userResponse.status != "200" && userResponse.status != "201" && userResponse.status != "203" && userResponse.status != "204" )
    {
      console.log(response.status)
      console.log('login error')
      return;
    }
    setValidLogin(true);
  }

  return (
    <View>
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={styles.appleButton}
        onPress={() => onAppleButtonPress()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appleButton: {
    width: ScreenWidth*.9,
    height: 55,
    shadowColor: '#555',
    borderRadius: 60,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 3
    },
    marginVertical: 15,
  }
});

export default AppleAuth;

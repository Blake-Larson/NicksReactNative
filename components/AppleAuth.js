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
    console.log('appleAuthRequestResponse', appleAuthRequestResponse)
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    console.log('credentialState', credentialState)
    if (credentialState === appleAuth.State.AUTHORIZED) {
    // user is authenticated
    console.log('USER IS AUTHENTICATED')
    console.log('USER IS AUTHENTICATED')
    console.log('USER IS AUTHENTICATED')
    console.log('USER IS AUTHENTICATED')
    console.log('USER IS AUTHENTICATED')

  }

    const output = jwt_decode(appleAuthRequestResponse.identityToken)
    console.log('output', output)
    const { email, email_verified, is_private_email, sub } = jwt_decode(appleAuthRequestResponse.identityToken)
    let lastname = null;
    if (appleAuthRequestResponse.fullName) lastname = appleAuthRequestResponse.fullName.familyName;
    let firstname = null;
    if (appleAuthRequestResponse.fullName) firstname = appleAuthRequestResponse.fullName.givenName;
    if (!appleAuthRequestResponse.identityToken) console.log('Apple Sign-In failed - no identify token returned');

    /**/
    const response = await fetch(`https://hautewellnessapp.com/apple/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({"id_token": appleAuthRequestResponse.identityToken })
    })
    console.log('response', response)

    if (response.status != "200" && response.status != "201" && response.status != "203" && response.status != "204" )
    {
      setLoginError(true);
      setLoginLoading(false);
      return;
    }

    await AsyncStorage.setItem("REFRESH_TOKEN", appleAuthRequestResponse.identityToken);
    await AsyncStorage.setItem("APPLE_SUB", sub);

    const userParams = {};
    userParams['firstname'] = firstname;
    userParams['lastname'] = lastname;
    userParams['email'] = email;
    userParams['apple_sub'] = sub;
    userParams['id_token'] = appleAuthRequestResponse.identityToken;

    const userResponse = await fetch(`https://hautewellnessapp.com/api/user_metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(userParams)
    });

    const metadata = await userResponse.json();
    await AsyncStorage.setItem("USER_METADATA", JSON.stringify(metadata));
    setValidLogin(true);
  }

  // responding to a user revoking access
  let authCredentialListener = null;
  useEffect(() => {
    authCredentialListener = appleAuth.onCredentialRevoked(async () => {
      //user credentials have been revoked. Sign out of account
        console.log('revoked!!!!!')
        console.log('revoked!!!!!')
        console.log('revoked!!!!!')
        console.log('revoked!!!!!')
        console.log('revoked!!!!!')
        console.log('revoked!!!!!')
    });
    return (() => {
     if (authCredentialListener.remove !== undefined) {
        console.log('removed........')
        console.log('removed........')
        console.log('removed........')
        console.log('removed........')
        console.log('removed........')
        console.log('removed........')
        console.log('removed........')
        console.log('removed........')
        authCredentialListener.remove();
      }
    })
  }, []);


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

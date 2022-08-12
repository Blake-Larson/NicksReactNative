import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import auth from '@react-native-firebase/auth';

import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

const AppleAuth = ({setValidLogin}) => {

  async function onAppleButtonPress() {

  // Start the sign-in request
  console.log('\n\n\n')
  console.log('                           ^^^^^^^^^^^^^^^ HERE')
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
  console.log('                           ^^^^^^^^^^^^^^^ DONE')
  console.log('email')
  console.log(email)
  console.log('family name')
  console.log(appleAuthRequestResponse.fullName.familyName);
  console.log('given name')
  console.log(appleAuthRequestResponse.fullName.givenName);

  let lastname = null;
  if (appleAuthRequestResponse.fullName) lastname = appleAuthRequestResponse.fullName.familyName;
  let firstname = null;
  if (appleAuthRequestResponse.fullName) firstname = appleAuthRequestResponse.fullName.givenName;

  console.log('user sub id')
  console.log(appleAuthRequestResponse.user);
  console.log(sub)
  console.log('             check this            *')


  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

console.log('*************************************************************');

console.log(JSON.stringify({"id_token": appleAuthRequestResponse.identityToken, "username": email}))

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
    return 'error';
  }
//  const data = await response.json();

  //console.log('data');
  //console.log(data);
  //console.log(data.authData.email);
  console.log('token !!!!!!!!                             !!!!!!');
  console.log(appleAuthRequestResponse.identityToken)
  await AsyncStorage.setItem("REFRESH_TOKEN", appleAuthRequestResponse.identityToken);

  const userParams = {};
  userParams['firstname'] = firstname;
  userParams['lastname'] = lastname;
  userParams['email'] = email;
  userParams['apple_sub'] = sub;
  userParams['id_token'] = appleAuthRequestResponse.identityToken;

console.log('user meta data         PARAMS!!!')
console.log(userParams)
  const userResponse = await fetch(`https://hautewellnessapp.com/api/user_metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(userParams)
    })
  console.log('userResponse');
  console.log(userResponse);
  console.log(userResponse.status)
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
    width: '100%',
    height: 45,
    shadowColor: '#555',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 3
    },
  marginVertical: 15,
}

});

export default AppleAuth;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import jwt_decode from 'jwt-decode';

//import auth from '@react-native-firebase/auth';

import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';



const AppleAuth = (props) => {

  async function onAppleButtonPress() {
    /*
    WORKS
  // performs login request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  console.log(appleAuthRequestResponse)
  const { email, email_verified, is_private_email, sub, iss, aud, iat, exp, nonce, nonce_supported, real_user_status } = jwt_decode(appleAuthRequestResponse.identityToken)
  console.log('email', email)
  console.log('email_verified', email_verified)
  console.log('sub', sub)
  console.log('iss', iss)
  console.log('aud', aud)
  console.log('iat', iat)
  console.log('exp', exp)
  console.log('nonce', nonce)
  console.log('nonce_supported', nonce_supported)

  console.log('real_user_status', real_user_status)


  const {
        identityToken,
      } = appleAuthRequestResponse;

  console.log('identityToken');
  console.log(identityToken);
  // get current authentication state for user
  // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

  // use credentialState response to ensure the user is authenticated
  if (credentialState === appleAuth.State.AUTHORIZED) {
    // user is authenticated
    console.log('user authenticated')
  }
  */
  // Start the sign-in request
  console.log('\n\n\n')
  console.log('                           ^^^^^^^^^^^^^^^ HERE')
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  console.log(appleAuthRequestResponse)
  console.log('                           ^^^^^^^^^^^^^^^ DONE')
  console.log(appleAuth.Scope.EMAIL)
  console.log(appleAuth.Operation.LOGIN)

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  // TODO: if not correct Apple url, error out


  // Create a Firebase credential from the response
  const { identityToken, nonce } = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

  // TODO: INSERT into users table if not SELECTed
  // TODO: if not correct Apple url, error out


  // Sign the user in with the credential
  return auth().signInWithCredential(appleCredential);
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

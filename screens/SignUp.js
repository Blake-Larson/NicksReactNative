import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const SignUp = ({navigation, route}) => {

  const [hidePassword, setHidePassword] = useState(true);
  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [errorEmailUsed, setErrorEmailUsed] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);
  const [errorLabel, setErrorLabel] = useState([]);

  const registerUser = async () => {

    setErrorEmailUsed(false);
    setErrorFlag(true);
    setErrorLabel([]);

    const bodyParams = {}
    bodyParams['first_name'] = firstName;
    bodyParams['last_name'] = lastName;
    bodyParams['password'] = password;
    bodyParams['email'] = email;

    const response = await fetch(`https://perr7czmsoa3a2k5vnkkp6xehu0nzlty.lambda-url.us-west-1.on.aws/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(bodyParams)
    });
    console.log('response', response);
    console.log('response', response.status);
    const output = await response.json();
    console.log(output)
    if (output.statusCode == 500)
    {
      console.log(bodyParams)
      console.log('errr ... ? ', output.err);
      if (output.err && output.err.code == "UsernameExistsException" || output.err.name == "UsernameExistsException")
      {
        setErrorFlag(true);
        setErrorLabel("Email Already Exists")
      }
      if (output.err && output.err.code == "InvalidParameterException" || output.err.name == "InvalidParameterException")
      {
        setErrorFlag(true);
        setErrorLabel("Invalid Field")
      }
      if (output.err && output.err.code == "InvalidPasswordException" || output.err.name == "InvalidPasswordException")
      {
        setErrorFlag(true);
        setErrorLabel("Password must contain: 1 number, 1 lowercase letter, 1 uppercase letter, 1 special character")
      }
      return;

      //InvalidPasswordException
    }

    if (output && output.message && output.message.toLowerCase() == 'user already created') setErrorEmailUsed(true);
    if (output && output.message && output.message.toLowerCase() == 'user already created') return;

    if (response.status == 200) navigation.navigate('VerifyEmail', [navigation, route])
    if (response.status == '200') navigation.navigate('VerifyEmail', [navigation, route])

    const params = {};
    params['first_name'] = firstName;
    params['last_name'] = lastName;
    params['email'] = email;
    params['password'] = password;

    navigation.navigate('VerifyEmail', [params]);
  }

  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Login', [])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
        <View style={{"backgroundColor": "black", paddingTop: 25}}>
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, fontWeight: "bold"}}>Create an Account</Text>
          <Text style={{color: "white", marginLeft: 20, marginTop: 20, fontSize: 25}}>First Name</Text>
          <TextInput style={{backgroundColor: "white",  marginLeft: 20, marginTop: 10, height: 45, fontWeight: "bold", fontSize: 18, width: "90%"}} onChangeText={(e) => {setFirstName(e)}} value={firstName} keyboardType="default" />
          <Text style={{color: "white", marginLeft: 20, marginTop: 20, fontSize: 25}}>Last Name</Text>
          <TextInput style={{backgroundColor: "white",  marginLeft: 20, marginTop: 10, height: 45, fontWeight: "bold", fontSize: 18, width: "90%"}} onChangeText={(e) => {setLastName(e)}} value={lastName} keyboardType="default" />
          <Text style={{color: "white", marginLeft: 20, marginTop: 20, fontSize: 25}}>Email</Text>
          <TextInput autoCapitalize={"none"} style={{backgroundColor: "white",  marginLeft: 20, marginTop: 10, height: 45, fontWeight: "bold", fontSize: 18, width: "90%"}} onChangeText={(e) => {setEmail(e)}} value={email} keyboardType="default" />
          <Text style={{color: "white", marginTop: 20, marginLeft: 20, fontSize: 25}}>Password</Text>
          <View autoCapitalize={"none"} style={{flexDirection: "row",  marginTop: 10, marginLeft: 20, height: 45, }}>
            <TextInput secureTextEntry={hidePassword} style={{backgroundColor: "white",fontWeight: "bold", fontSize: 18, width: "80%"}} onChangeText={(e) => {setPassword(e)}} value={password} keyboardType="default" />
            <TouchableOpacity style={{width: "10%", backgroundColor: "white",  verticalAlign: "center"}} onPress={() => setHidePassword(!hidePassword)}>
              {
                hidePassword == true ? <ImageBackground style={{color: "red", height: 25, width: 25, marginTop: 5}} source={require("../media/hidepassword.png")} /> :
                <ImageBackground style={{color: "white", height: 25, width: 25, verticalAlign: "center", marginTop: 5}} source={require("../media/showpassword.png")} />
              }
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn', [])}
            style={{backgroundColor: "black", flexDirection: "row", width: "90%",height: 40, fontSize: 24, marginTop: 20, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}>
            <Text style={{color: "white", fontSize: 16}}>Already Have an Account?</Text>
            <Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}>   Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{backgroundColor: "white", width: "90%", height: 50, marginTop: 15, alignSelf: 'center', alignItems: "center", justifyContent: "center"}}
            onPress={() => registerUser()}>
            <Text style={{fontSize: 25, fontWeight: "bold"}}>Continue</Text>
          </TouchableOpacity>
        </View>
        { errorFlag &&
          <Text style={{color: "red", fontSize: 20, marginTop: 10, textAlign: "center"}}>{errorLabel}</Text>
        }
      </ScrollView>
    </SafeAreaView>
  )
};

export default SignUp;

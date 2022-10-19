import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScrollView, StatusBar, StyleSheet, Text, Button, View, Image, Stack, Dimensions } from 'react-native';
import { BrowserRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRunning, faCog, faChartBar } from '@fortawesome/free-solid-svg-icons';

import Workouts from './screens/Workouts';
import WorkoutSelected from './screens/WorkoutSelected';
import WorkoutCourse from './screens/WorkoutCourse';
import UserProgress from './screens/UserProgress';
import Settings from './screens/Settings';
import ExercisePreview from './screens/ExercisePreview';
import AccountDetails from './screens/AccountDetails';
import Profile from './screens/Profile';
import SettingsHelp from './screens/SettingsHelp';
import AppleAuth from './components/AppleAuth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Purchases from 'react-native-purchases';
import { useIsFocused } from "@react-navigation/native";

const App = () => {

  const [initializing, setInitializing] = useState(false);
  const [validLogin, setValidLogin] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [token, setToken] = useState({});
  const [paywallShown, setPaywallShown] = useState(true);
  const [subInfo, setSubInfo] = useState([]);

  const validateSession = async () => {

    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    const sub = await AsyncStorage.getItem("APPLE_SUB");

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', storageToken);

    const response = await fetch(`https://hautewellnessapp.com/apple/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({"id_token": storageToken})
    });
    if (response.status != "200" && response.status != "201" && response.status != "203" && response.status != "204" )
    {
      console.log('login error', response.status);
      setLoadingScreen(false);
      return 'error';
    }

    const userParams = {};
    userParams['apple_sub'] = sub;
    userParams['id_token'] = storageToken;
    console.log('userParams');

    const userResponse = await fetch(`https://hautewellnessapp.com/api/user_metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(userParams)
    });
    if (userResponse.status != "200" && userResponse.status != "201" && userResponse.status != "203" && userResponse.status != "204" )
    {
      console.log('login error', response.status)
      setLoadingScreen(false);
      return 'error';
    }
    const metadata = await userResponse.json();
    await AsyncStorage.setItem("USER_METADATA", JSON.stringify(metadata));
    setLoadingScreen(false);
    setValidLogin(true);
  }

  const setupNotifications = () => {
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener('register', onRegistered);
    PushNotificationIOS.addEventListener('registrationError', onRegistrationError);
    PushNotificationIOS.addEventListener('localNotification', onLocalNotification);
    PushNotificationIOS.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
    }).then((data) => {
      console.log('PushNotificationIOS.requestPermissions', data);
    }, (err) => {
      console.error('[NOTIFICATIONS] register error: ', err);
    });
  }

  const onRegistered = (deviceToken) => {
    setToken(deviceToken)
    console.log('Registered For Remote Push', `Device Token: ${deviceToken}`)
  };

  const onRemoteNotification = (notification) => {
    console.log('remote notification !')
    const isClicked = notification.getData().userInteraction === 1;
    setToken('remote notificaiton')
    if (isClicked) {
     // Navigate user to another screen
    } else {
     // Do something else with push notification
    }
  };

  const onRegistrationError = (remoteNotification) => {
   console.log('onRegistrationError', remoteNotification)
  };

  const onLocalNotification = () => {
  // console.log('onLocalNotification', locaNotification)
  };

  const checkUserMembership = async () => {

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setSubInfo(customerInfo);
      console.log(';customerInfo !!!!!!', customerInfo);
      console.log('----')
      console.log(customerInfo.entitlements.active)
      console.log('?')
      console.log(customerInfo.entitlements)
      console.log(typeof customerInfo.entitlements.active.pro)

      if (customerInfo.entitlements.active.pro)
      {
        setPaywallShown(false);
      }
    } catch (e)
    {
      console.log('membership error: ', e);
    }
  }

  const purchaseSetup = async () => {

    console.log(' purcahse set up ! ')

    const sub = await AsyncStorage.getItem("APPLE_SUB");
    console.log(sub)
    Purchases.setDebugLogsEnabled(true);
    //Purchases.setup();
    Purchases.configure({apiKey: "appl_lQHbtXbTPqowgQucoJxnfxzMeMz", appUserId: sub});
    const purchaseResult = await Purchases.logIn(sub);
    console.log(purchaseResult)
    console.log('purchaserInfo', purchaseResult.customerInfo)
    console.log('created', purchaseResult.created)

    checkUserMembership();

  }

  useEffect(() => {
    validateSession();
    setupNotifications();
  }, []);


  useEffect(() => {
    console.log('REFRESH SUB INFO')
    console.log('REFRESH SUB INFO')
    console.log('REFRESH SUB INFO')
    console.log('REFRESH SUB INFO')
    console.log('REFRESH SUB INFO')
    console.log('REFRESH SUB INFO')
    console.log('REFRESH SUB INFO')

    purchaseSetup();
  }, [paywallShown]);


  if (loadingScreen) {
    return (
      <View style={{backgroundColor: "black", height: 1000}}>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
        <Text style={{color: "white"}}> LOADING ... </Text>
      </View>
    )
  }

  if (!validLogin) {
    return (
      <View style={{flex:1, alignItems: 'center', height: ScreenHeight, backgroundColor: "black"}}>
        <Text style={{color: "white", fontSize: 45, marginTop: 100}}> Haute Wellness </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <Text> LOGIN ! </Text>
        <View style={{position:'absolute', bottom:80}}>
          <AppleAuth setValidLogin={setValidLogin} />
        </View>
      </View>
    );
  }


  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function HomeTabs() {
    return (
      <Tab.Navigator initialRouteName="Workouts" screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: "left",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
          height: 70,
        },
        tabBarActiveTintColor: 'red'}}>
          <Tab.Screen
            name="UserProgress"
            component={UserProgress}
            options={{
              headerShown: false,
              tabBarOptions: { activeTintColor: '#fff',
              activeBackgroundColor: 'red' },
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faChartBar } size={25} color={color}/>)
            }} />
          <Tab.Screen
            name="Workouts"
            children={({navigation, route}) =>
              <Workouts
                navigation={navigation}
                paywallShown={paywallShown}
                setPaywallShown={setPaywallShown}
                subInfo={subInfo}/>}
            options={{
              headerShown: false,
              tabBarOptions: { backgroundColor: "black", activeTintColor:'red', visible: false},
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faRunning } size={25} color={color}/>)
           }} />
          <Tab.Screen
            name="Settings"
            children={({navigation})=><Settings setValidLogin={setValidLogin} navigation={navigation}/>}
            options={{
              headerShown: false,
              tabBarOptions: { activeTintColor:'red' },
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faCog } size={25} color={color}/>)
          }}/>
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer options={{ color: "black" }} >
      <Stack.Navigator >
        <Stack.Screen options={{ headerShown: false, activeTintColor: '#fff',
        activeBackgroundColor: '#c4461c' }}  name="Home" component={HomeTabs} />
        <Stack.Screen name="WorkoutSelected" options={{headerShown: false}}>
          {({navigation, route}) => (<WorkoutSelected navigation={navigation} route={route}/>)}
        </Stack.Screen>
        <Stack.Screen name="WorkoutCourse" options={{headerShown: false}} >
          {({navigation, route}) => (<WorkoutCourse navigation={navigation} route={route}/>)}
        </Stack.Screen>
        <Stack.Screen name="ExercisePreview" options={{headerShown: false}}>
          {({navigation, route}) => (<ExercisePreview navigation={navigation} route={route}/>)}
        </Stack.Screen>
        <Stack.Screen name="AccountDetails" options={{headerShown: false}}>
          {({navigation, route}) => (
            <AccountDetails
              navigation={navigation}
              route={route}
              paywallShown={paywallShown}
              setPaywallShown={setPaywallShown}
              subInfo={subInfo}
            />)}
        </Stack.Screen>
        <Stack.Screen name="Profile" options={{headerShown: false}}>
          {({navigation, route}) => (<Profile navigation={navigation} route={route}/>)}
        </Stack.Screen>
        <Stack.Screen name="SettingsHelp" options={{headerShown: false}}>
          {({navigation, route}) => (<SettingsHelp navigation={navigation} route={route}/>)}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 50
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

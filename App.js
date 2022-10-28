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
import * as Progress from 'react-native-progress';
const moment = require('moment');

const App = () => {

  const [initializing, setInitializing] = useState(false);
  const [validLogin, setValidLogin] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [token, setToken] = useState({});
  const [paywallShown, setPaywallShown] = useState(true);
  const [subInfo, setSubInfo] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [workouts, setWorkouts] = useState([]);

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

    await getWorkouts();
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
      // TODO: do I need to do anything here??
      // do these function listeners do anything? ??
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

    console.log('checking user membership')
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      console.log('customerInfo')
      console.log(JSON.stringify(customerInfo))

      setSubInfo(customerInfo);

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

    const sub = await AsyncStorage.getItem("APPLE_SUB");
    Purchases.setDebugLogsEnabled(true);
    Purchases.configure({apiKey: "appl_lQHbtXbTPqowgQucoJxnfxzMeMz", appUserId: sub});
    const purchaseResult = await Purchases.logIn(sub);

    checkUserMembership();
  }

    const getWorkouts = async () => {

      const date = new Date("9/5/2022");
      const mon = moment(date).isoWeekday(1).format('YYYY-MM-DD');
      const tues = moment(date).isoWeekday(2).format('YYYY-MM-DD')
      const wed = moment(date).isoWeekday(3).format('YYYY-MM-DD');
      const thurs = moment(date).isoWeekday(4).format('YYYY-MM-DD');
      const fri = moment(date).isoWeekday(5).format('YYYY-MM-DD');
      const sat = moment(date).isoWeekday(6).format('YYYY-MM-DD');
      const sun = moment(date).isoWeekday(7).format('YYYY-MM-DD');
      const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");

      const api = `https://a7h5fjn6ig.execute-api.us-west-1.amazonaws.com/dev/getWorkoutsThisWeek`;
      const apiParams = {};
      apiParams['monday'] = mon;
      apiParams['tuesday'] = tues;
      apiParams['wednesday'] = wed;
      apiParams['thursday'] = thurs;
      apiParams['friday'] = fri;
      apiParams['saturday'] = sat;
      apiParams['sunday'] = sun;
      apiParams['id_token'] = storageToken;
      console.log('got workout resopnse')

      const response = await fetch(api, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       credentials: 'same-origin',
       body: JSON.stringify(apiParams)
      });
      const scheduleData = await response.json();
      const weekday = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"];
      const workoutWeek = [];

      for (let i = 0; i < scheduleData.length; i++)
      {
        const newKvt = [];
        const row = scheduleData[i];
        const d = new Date(row['schedule_date']);
        let day = weekday[d.getDay()];

        const weeklyObj = {};
        weeklyObj['day'] = day;
        weeklyObj['workoutid'] = row['workoutid'];
        weeklyObj['schedule_date'] = row['schedule_date'];
        weeklyObj['name'] = row['name'];
        weeklyObj['filename'] = row['filename'];
        weeklyObj['json_content'] = row['json_content'];

        workoutWeek.push(weeklyObj);
      }
      setWorkouts(workoutWeek)
      console.log('workouts set')


  /*
    //API GATEWAY -> LAMBDA EXAMPLE
      const api2 = `https://1tykl3w05h.execute-api.us-west-1.amazonaws.com/default/getWorkoutsThisWeek`;
      const response2 = await fetch(api2, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       credentials: 'same-origin',
      });
      const jsonTest = await response2.json();
      console.log('output 2', jsonTest)
  */
    };

    const getCompletedWorkouts = async () => {

      const date = new Date("9/5/2022");
      const completedWeekArray = [];
      completedWeekArray.push(moment(date).isoWeekday(1).format('YYYY-MM-DD'));
      completedWeekArray.push(moment(date).isoWeekday(2).format('YYYY-MM-DD'));
      completedWeekArray.push(moment(date).isoWeekday(3).format('YYYY-MM-DD'));
      completedWeekArray.push(moment(date).isoWeekday(4).format('YYYY-MM-DD'));
      completedWeekArray.push(moment(date).isoWeekday(5).format('YYYY-MM-DD'));
      completedWeekArray.push(moment(date).isoWeekday(6).format('YYYY-MM-DD'));
      completedWeekArray.push(moment(date).isoWeekday(7).format('YYYY-MM-DD'));

      const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
      const userMetaDataString = await AsyncStorage.getItem("USER_METADATA");
      const userMetaData = JSON.parse(userMetaDataString);
      const userid = userMetaData[0]['userid'];

      const api = `https://3cn9i38spk.execute-api.us-west-1.amazonaws.com/dev/getCompletedWorkouts`;
      const apiParams = {};
      apiParams['monday'] = moment(date).isoWeekday(1).format('YYYY-MM-DD')
      apiParams['tuesday'] = moment(date).isoWeekday(2).format('YYYY-MM-DD')
      apiParams['wednesday'] = moment(date).isoWeekday(3).format('YYYY-MM-DD');
      apiParams['thursday'] = moment(date).isoWeekday(4).format('YYYY-MM-DD');
      apiParams['friday'] = moment(date).isoWeekday(5).format('YYYY-MM-DD');
      apiParams['saturday'] = moment(date).isoWeekday(6).format('YYYY-MM-DD');
      apiParams['sunday'] = moment(date).isoWeekday(7).format('YYYY-MM-DD');
      apiParams['userid'] = userid;
      apiParams['id_token'] = storageToken;

      const response = await fetch(api, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       credentials: 'same-origin',
       body: JSON.stringify(apiParams)
      });
      const scheduleData = await response.json();
      const outputWorkoutsCompleted = [];

      for (let i = 0; i < scheduleData.length; i++)
      {
        let test = moment(scheduleData[i]['schedule_date']).isoWeekday();
        if (test == 7) test = 0;
        outputWorkoutsCompleted.push(test);
      }
      setCompletedWorkouts(outputWorkoutsCompleted);
      console.log('completedWorkouts in use effect !', completedWorkouts)
    }

  useEffect(() => {
    validateSession();
    setupNotifications();
    checkUserMembership();
  }, []);

  useEffect(() => {
    getCompletedWorkouts();
  }, [workoutComplete]);


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
      <View style={{backgroundColor: "black", height: 1000,flex: 1,
    justifyContent: 'center',
    alignItems: 'center'}}>
        <View style={{backgroundColor: "black", marginTop: 300,flex: 1, }}>
            <Progress.Circle
              size={200}
              indeterminate={true}
              endAngle={0.8}
              showsText={true}
              color={"white"}>
            </Progress.Circle>
        </View>
        <View style={{    position: 'absolute',
          top: 350,
          right: 150,
          bottom: 0,  }}>
          <Image source={require('./media/hwlogo.png')} style={{height: 100, width: 100,  borderRadius: 25}} />
        </View>
      </View>
    )
  }

  if (!validLogin) {
    return (
      <View style={{flex:1, alignItems: 'center', height: ScreenHeight, backgroundColor: "black"}}>
        <View style={{position:'absolute', bottom: 340}}>
          <Image source={require('./media/hwlogo.png')} style={{height: 300, width: 300,  borderRadius: 25}} />
        </View>
        <View style={{position:'absolute', bottom: 190, left: 10}}>
          <Text style={{color: "white", fontWeight: "bold", fontSize: 45, marginTop: 100}}> Haute Wellness </Text>
        </View>
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
        tabBarActiveTintColor: '#D6B22E'}}>
          <Tab.Screen
            name="UserProgress"
            component={UserProgress}
            options={{
              headerShown: false,
              tabBarOptions: { activeTintColor: '#fff',
              activeBackgroundColor: '#D6B22E' },
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faChartBar } size={25} color={color}/>)
            }} />
          <Tab.Screen
            name="Workouts"
            children={({navigation, route}) =>
              <Workouts
                navigation={navigation}
                paywallShown={paywallShown}
                setPaywallShown={setPaywallShown}
                subInfo={subInfo}
                setSubInfo={setSubInfo}
                completedWorkouts={completedWorkouts}
                workouts={workouts}/>}
            options={{
              headerShown: false,
              tabBarOptions: { backgroundColor: "black", activeTintColor:'#D6B22E', visible: false},
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faRunning } size={25} color={color}/>)
           }} />
          <Tab.Screen
            name="Settings"
            children={({navigation})=><Settings setValidLogin={setValidLogin} navigation={navigation}/>}
            options={{
              headerShown: false,
              tabBarOptions: { activeTintColor:'#D6B22E' },
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
          {({navigation, route}) => (<WorkoutCourse navigation={navigation} route={route} setWorkoutComplete={setWorkoutComplete} workoutComplete={workoutComplete}/>)}
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
              setSubInfo={setSubInfo}
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

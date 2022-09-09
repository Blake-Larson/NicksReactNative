import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import auth from '@react-native-firebase/auth';

import type {Node} from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, Button, useColorScheme, View, Image, Stack } from 'react-native';
import { BrowserRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRunning, faCog, faChartBar } from '@fortawesome/free-solid-svg-icons';

import Workouts from './screens/Workouts';
import WorkoutSelected from './screens/WorkoutSelected';
import WorkoutCourse from './screens/WorkoutCourse';
import UserProgress from './screens/UserProgress';
import Settings from './screens/Settings';
import ExercisePreview from './screens/ExercisePreview';
import AppleAuth from './components/AppleAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";

const Section = ({children, title}): Node => {

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};


const App = () => {

  const WorkoutsStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [initializing, setInitializing] = useState(false);
  const [uid, setUid] = useState([]);
  const [validLogin, setValidLogin] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [token, setToken] = useState({});

  const validateSession = async () => {

    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    const sub = await AsyncStorage.getItem("APPLE_SUB");

    console.log('storageToken')
    console.log(storageToken)
    console.log('\n\n\n')
    console.log('get current user ~~~~~~~ @@@@');


    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', storageToken);

    const response = await fetch(`https://hautewellnessapp.com/apple/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({"id_token": storageToken})
      });
    console.log('response ***** -------');
    if (response.status != "200" && response.status != "201" && response.status != "203" && response.status != "204" )
    {
      console.log(response.status)
      console.log('login error')
      setLoadingScreen(false);
      return 'error';
    }

    const userParams = {};
    userParams['apple_sub'] = sub;
    userParams['id_token'] = storageToken;
    console.log('userParams');
    console.log(userParams);

    const userResponse = await fetch(`https://hautewellnessapp.com/api/user_metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(userParams)
    });
    console.log('userResponse', userResponse.status);
    if (userResponse.status != "200" && userResponse.status != "201" && userResponse.status != "203" && userResponse.status != "204" )
    {
      console.log(response.status)
      console.log('login error')
      setLoadingScreen(false);
      return 'error';
    }
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

  const onLocalNotification = (localNotification) => {
   console.log('onLocalNotification', locaNotification)
  };

  const notifyPress = () => {
    console.log('notify press')
    PushNotification.localNotification({
      title: "title hw",
      message: "hw"
    });
  }

  useEffect(() => {
    validateSession();
    setupNotifications();
  }, []);

  if (loadingScreen) {
    return (
      <View>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
        <Text> LOADING ... </Text>
      </View>
    )
  }

  if (!validLogin) {

    return (
      <View>
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
        <Text> token: {JSON.stringify(token)}</Text>
        <Button title="notify" onPress={notifyPress} />
        <AppleAuth setValidLogin={setValidLogin} />
      </View>
    );
  }

  function WorkoutsStackScreen() {
    return (
      <WorkoutsStack.Navigator
        options={{ headerShown: false }}>
        <WorkoutsStack.Screen name="Workout">
          {({navigation, route}) => (<Workouts uid={uid} navigation={navigation} route={route}/>)}
        </WorkoutsStack.Screen>
        <WorkoutsStack.Screen name="WorkoutSelected">
          {({navigation, route}) => (<WorkoutSelected uid={uid} navigation={navigation} route={route}/>)}
        </WorkoutsStack.Screen>
        <WorkoutsStack.Screen name="WorkoutCourse">
          {({navigation, route}) => (<WorkoutCourse uid={uid} navigation={navigation} route={route}/>)}
        </WorkoutsStack.Screen>
        <WorkoutsStack.Screen name="ExercisePreview">
          {({navigation, route}) => (<ExercisePreview uid={uid} navigation={navigation} route={route}/>)}
        </WorkoutsStack.Screen>
      </WorkoutsStack.Navigator>
    );
  }
  return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Workouts"
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
              height: 70,
            },
            tabBarActiveTintColor: '#e91e63',
          }}>
          <Tab.Screen
            name="UserProgress"
            options={{
              tabBarOptions: { activeTintColor: '#fff',
              activeBackgroundColor: '#c4461c' },
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faChartBar } size={25} color={color}/>)
            }}>
              {() => (<UserProgress uid={uid} />)}
            </Tab.Screen>
          <Tab.Screen
            name="Workouts"
            component={WorkoutsStackScreen}
            options={{
              headerShown: false,
              tabBarOptions: { activeTintColor:'red' },
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faRunning } size={25} color={color}/>)
           }}
          />
          <Tab.Screen
            name="Settings"
            children={()=><Settings setValidLogin={setValidLogin}/>}
            options={{
              headerShown: false,
              tabBarOptions: { activeTintColor:'red' },
              tabBarIcon: ({color}) => (<FontAwesomeIcon icon={ faCog } size={25} color={color}/>)
           }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
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

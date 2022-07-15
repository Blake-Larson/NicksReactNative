/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
//
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import auth from '@react-native-firebase/auth';

import type {Node} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
  Image,
  Stack,
} from 'react-native';
import { BrowserRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRunning, faCog, faChartBar } from '@fortawesome/free-solid-svg-icons';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Workouts from './screens/Workouts';
import WorkoutSelected from './screens/WorkoutSelected';
import WorkoutCourse from './screens/WorkoutCourse';
import UserProgress from './screens/UserProgress';
import Settings from './screens/Settings';
import ExercisePreview from './screens/ExercisePreview';
//import AppleAuth from './components/AppleAuth';

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
  const [userToken, setUserToken] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [user, setUser] = useState([]);
  const [uid, setUid] = useState([]);

  console.log('app...')
  /*

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) console.log(user._user.providerData[0].uid)
    console.log('SETTING            &&&7  ')
    if (!user || !user._user || !user._user.providerData[0]) setUid(null);
    if (user && user._user && user._user.providerData[0]) setUid(user._user.providerData[0].uid)
    if (initializing) setInitializing(false);
  }
  */

  useEffect(() => {
    /*
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log('subscriber')
    console.log(subscriber)

    return subscriber; // unsubscribe on unmount
    */
  }, []);

  if (initializing) return null;

  if (!user) {
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
        <Button onPress={validateLogin} title="Complete!"></Button>
      </View>
    );
  }

  const validateLogin = () => {
    setUserToken(true);
  };

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
            component={Settings}
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
/*
<Stack.Navigator initalRouteName="FitAppMenu">
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="FitAppMenu" component={FitAppMenu} />
  <Stack.Screen name="ProgressMade" component={ProgressMade} />
  <Stack.Screen name="Workouts" component={Workouts} />
  <Stack.Screen name="WorkoutSelected" component={WorkoutSelected} />
</Stack.Navigator>
*/
/*<SafeAreaView style={backgroundStyle}>
  <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={backgroundStyle}>
    <Header />
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}>
      <Section title="Step One">
        Woah.. {count}
      </Section>
      <Section title="Badges">
        firebase: {test}
        <Badges></Badges>
      </Section>
      <Section title="See Your Changes">
        <ReloadInstructions />
      </Section>
      <Section title="Debug">
        <DebugInstructions />
      </Section>
      <Button onPress={this.activateLasers} title={`Count is ${count}`} />
      <Section title="Learn More">
        Read the docs to discover what to do next:
      </Section>
      <LearnMoreLinks />
    </View>
  </ScrollView>
</SafeAreaView>*/

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

/*<SafeAreaView style={backgroundStyle}>
  <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    style={backgroundStyle}>
    <Header />
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}>
      <Section title="Step One">
        Woah.. {count}
      </Section>
      <Section title="Badges">
        firebase: {badges}
      </Section>
      <Section title="See Your Changes">
        <ReloadInstructions />
      </Section>
      <Section title="Debug">
        <DebugInstructions />
      </Section>
      <Button onPress={this.activateLasers} title={`Count is ${count}`} />
      <Section title="Learn More">
        Read the docs to discover what to do next:
      </Section>
      <button>test</button>
      <LearnMoreLinks />
    </View>
  </ScrollView>
</SafeAreaView>*/

export default App;

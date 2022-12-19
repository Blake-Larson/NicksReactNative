import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Button, Image, Dimensions, ScrollView, SafeAreaView, Linking,Pressable, Share,
          StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated, StatusBar, ImageBackground } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import DatePicker from 'react-native-date-picker';
const moment = require('moment');
import * as Progress from 'react-native-progress';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import apiMiddleware from '../backend/apiMiddleware.js';

const RNFS = require("react-native-fs");
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutContent from "../components/WorkoutContent.js";

const HEADER_MAX_HEIGHT = 340;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const WorkoutSelected = ({navigation, route, setValidLogin}) => {

  const title = route.params[0].name;
  const image = route.params[0].filename;
  const time = route.params[0].time;
  const json_content = JSON.parse(route.params[0].json_content);
  const content = json_content['course_content'];
  const schedule_date = route.params[0]['schedule_date'];
  const description = route.params[0].description;

  const [exerciseList, setExerciseList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [apnDisabled, setApnDisabled] = useState(false);
  const [musicModal, setMusicModal] = useState(false);
  const [fullWorkoutContent, setFullWorkoutContent] = useState([]);
  const [downloadDone, setDownloadDone] = useState(false);
  const [downloadTotal, setDownloadTotal] = useState(0);
  const [currentDownload, setCurrentDownload] = useState(0);
  const [progress, setProgress] = useState(0.10);
  const [showRnfsDownloadButton, setShowRnfsDownloadButton] = useState(false);
  const [startWorkout, setStartWorkout] = useState(false);
  const [showLoadScreen, setShowLoadScreen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const workoutSelectedData = async () => {

    const filenamecontent = await getExerciseById();
    console.log('starting to download')
    await rnfsDownload(filenamecontent);
    console.log('finsihed to download ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
  }

  const getExerciseById = async () => {

    const exerciseArray = [];
    for (let i = 0; i < content.length; i++)
    {
      const exerciseid = content[i]['exerciseid'];
      exerciseArray.push(exerciseid);
    }
    const finalArr = exerciseArray.join(',');
    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");

    const api = `https://hb2ah52aqf.execute-api.us-west-1.amazonaws.com/dev/getExerciseById`;
    const apiParams = {};
    apiParams['exerciseid'] = finalArr;

    const response = await apiMiddleware(api, apiParams, setValidLogin);
    // TODO: add error messages
    const data = await response.json();
    for (let i = 0; i < content.length; i++)
    {
      content[i]['filename'] = data[i]['filename'];
      content[i]['name'] = data[i]['name'];
      content[i]['description'] = data[i]['description'];
    }
    setFullWorkoutContent(content);
    setExerciseList(content);
    return content;
  };

  const beginWorkout = () => {

    const apiParams = {};
    apiParams['title'] = title;
    apiParams['exerciseList'] = exerciseList;
    apiParams['schedule_date'] = schedule_date;
    navigation.navigate('WorkoutCourse', [apiParams]);
    setStartWorkout(false);
  }

  const rnfsDownload = async (content) => {

    setDownloadTotal(content.length);

    for (let i = 0; i < content.length; i++)
    {
      setCurrentDownload(i)
      const row = content[i];
      const path = RNFS.DocumentDirectoryPath + `/${row['exerciseid']}.mp4`;
      if (await RNFS.exists(path))
      {
          const percent = (i + 1) / content.length;
          console.log(percent)
          RNFS.touch(path, new Date());
          setProgress(percent);
          continue;
      }
      else {
        console.log(`PATH ${path}  DOES NOT EXISTS`);
        setShowLoadScreen(true);
        const filename = row['filename'];
        console.log('now downloading: ', filename);

        const downloadInfo = await RNFS.downloadFile({ fromUrl: filename, toFile: path })
        if (await downloadInfo.promise) { console.log('downloaded!') }
        setProgress((i + 1)/ content.length);
      }
    }
    console.log('done with all downloads!!')
    setDownloadDone(true);
    setShowLoadScreen(false);
    setShowRnfsDownloadButton(true);
  }

  // TODO: remove debug for final
  const rnfsRemove = async () => {

    setShowRnfsDownloadButton(false);

    for (let i = 0; i < content.length; i++)
    {
      const row = content[i];

      const path = RNFS.DocumentDirectoryPath + `/${row['exerciseid']}.mp4`;
      if (await RNFS.exists(path))
      {
          RNFS.unlink(path)
          continue;
      }
      else {
        console.log(`PATH ${path}  DOES NOT EXISTS! skipping ----->`);
      }
    }
    console.log('done with removing all downloads!!')
  }

  useEffect(() => {

    workoutSelectedData();
    return () => {};
  }, []);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 3, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.9],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [210, 80, 18],
    extrapolate: 'clamp',
  });

  const notifyPress = () => {

    const incrementedMin = new Date(Date.now(date) + (60 * 1000))
    const details = {};
    details['fireDate'] = moment(incrementedMin).toISOString();
    details['title'] = 'Haute Wellness';
    details['alertTitle'] = 'Haute Wellness';
    details['alertBody'] = 'Workout Scheduled';

    PushNotificationIOS.cancelLocalNotifications();
    PushNotificationIOS.scheduleLocalNotification(details);
  }

  const shareApp = async () => {

    try {
      const result = await Share.share({ message: 'Check out Haute Wellness' });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      }
      else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    }
    catch (error) { console.log(error.message) }
  }

  const openScheduleWorkoutModal = () => {

    PushNotificationIOS.checkPermissions(Localarray => {
        if (Localarray['authorizationStatus'] != 2) setApnDisabled(true);
        if (Localarray['authorizationStatus'] == 2) setOpen(true);
    });
  }

  const confirmationModalPreview = () => {

    setShowConfirmationModal(true);
    setInterval(() => {
      setOpen(false)
      setDate(date)
      notifyPress()
      setShowConfirmationModal(false);
    }, 1500);
  }

  return (
    <View style={{flex: 1}}>
      <View style={{ position:'absolute',top:45, zIndex: 100}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Workouts', [])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.saveArea}>
        <Animated.ScrollView
          contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT - 32 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY }}}],
            { useNativeDriver: true },
          )}>
          <View style={{flexDirection: 'row', flex: 1, width: ScreenWidth, paddingBottom: 10,   alignItems: 'center',
            justifyContent: 'center'}}>
            <TouchableOpacity style={{width: 100, height: 58, alignItems: 'center',
              justifyContent: 'center'}}  onPress={() => { setMusicModal(true)}}>
                <ImageBackground style={{color: "white", height: 35, width: 35, marginBottom: 15, top: 0, flexDirection: 'row',flex: 1, position: 'absolute',alignItems: 'center',
                  justifyContent: 'center'}} source={require("../media/musicplayer.png")} />
                  <Text style={{position: "absolute", bottom: 0, marginTop: 10, "color": "white"}}>Music</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: 100, height: 60, alignItems: 'center',
              justifyContent: 'center',}} onPress={openScheduleWorkoutModal}>
                <ImageBackground style={{color: "white", height: 38, width: 38, marginBottom: 15, top: 0, flexDirection: 'row',flex: 1, position: 'absolute',alignItems: 'center',
                  justifyContent: 'center'}} source={require("../media/clock.png")} />
                <Text style={{position: "absolute", bottom: 0, marginTop: 10, "color": "white"}}> Schedule </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: 95, height: 60, alignItems: 'center',
              justifyContent: 'center',}} onPress={shareApp}>
                <ImageBackground style={{color: "white", height: 38, width: 38, marginBottom: 15, top: 0, flexDirection: 'row',flex: 1, position: 'absolute',alignItems: 'center',
                  justifyContent: 'center'}} source={require("../media/send.png")} />
                <Text style={{position: "absolute", bottom: 0, marginTop: 10, "color": "white"}}> Share </Text>
            </TouchableOpacity>
          </View>
          {
            showRnfsDownloadButton == true &&
            <Pressable style={{marginTop: 15, marginBottom: 15}} onPress={() => {rnfsRemove() }}>
              <Text style={{color: "white", fontSize: 10}}>DEBUG: remove cached content</Text>
            </Pressable>
          }
          <View style={{ width: ScreenWidth, paddingBottom: 10, paddingTop: 0,  alignItems: 'center', justifyContent: 'center'}}>
            { downloadDone == false && showLoadScreen == true &&
              <View style={{paddingTop: 30, alignItems: 'center', justifyContent: 'center'}}>
                <Progress.Circle progress={progress} size={100} showsText={true} color={"red"} allowFontScaling={true}/>
                <Text style={{color: "white", fontWeight: "bold", paddingTop: 30, fontSize: 20}}>Get Ready to Workout! </Text>
              </View>
            }
          </View>
          { downloadDone == true && <WorkoutContent navigation={navigation} route={route} content={fullWorkoutContent}/> }
        </Animated.ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
          <Animated.Image style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]} source={{uri: image}} />
        </Animated.View>
        <Animated.View
         style={[styles.topBar, { transform: [{ scale: titleScale }, { translateY: titleTranslateY }] },]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
       </Animated.View>
       {
         downloadDone == true &&
          <TouchableOpacity style={{width: 10, height: 10, marginBottom: 10}} style={styles.buttonStart} onPress={() => {setStartWorkout(true)}}  >
            <Text style={{fontWeight: "bold", fontSize: 20}}>Begin Workout</Text>
          </TouchableOpacity>
        }
      </SafeAreaView>
       <DatePicker
         modal
         mode={"time"}
         open={open}
         date={date}
         theme={"dark"}
         onConfirm={(date) => {confirmationModalPreview(date)}}
         onCancel={() => { setOpen(false)}}/>
        <Modal
          transparent={true}
          animationType="slide"
          visible={showConfirmationModal}>
          <View style={styles.apnModalContainer}>
            <View style={styles.scheduleConfirmModalView}>
              <Text style={{color: "white", fontSize: 30, textAlign: "center", fontWeight: "bold"}}>Workout Scheduled!</Text>
              <Image style={{height:60, width: 60, marginTop: 20, backgroundColor: "lightgreen", borderRadius: 31}} source={require('../media/check-mark.png')} />
            </View>
          </View>
        </Modal>
       <Modal
         transparent={true}
         animationType="slide"
         visible={apnDisabled}
         onRequestClose={() => { setApnDisabled(!apnDisabled) }}>
           <View style={styles.apnModalContainer}>
             <Pressable style={styles.apnModalContainer} onPress={() => {setApnDisabled(false)}} >
                <View style={styles.apnModalView}>
                  <View style={styles.scheduleModalView}>
                    <Text style={{fontWeight: "bold", color: "white", fontSize: 26}}>Notifications</Text>
                    <Text style={{fontWeight: "bold", color: "white", fontSize: 26}}>Are Disabled</Text>
                    <Text style={{marginTop: 15, fontSize: 18,  color: "white"}}> Enable Notifications</Text>
                    <Text style={{fontSize: 18,  color: "white"}}> In Settings </Text>
                  </View>
                  <TouchableOpacity  style={styles.closeApnModal} onPress={() => { setApnDisabled(false)}} >
                    <Text style={{fontWeight: "bold", color: "white", fontSize: 18}}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.openSettings}  onPress={() => { setApnDisabled(false), Linking.openURL('app-settings://notification/')}} >
                    <Text style={{fontWeight: "bold", fontSize: 20}}>Open Settings</Text>
                  </TouchableOpacity>
                </View>
            </Pressable>
          </View>
        </Modal>
        <Modal
          transparent={true}
          animationType="slide"
          visible={musicModal}
          onRequestClose={() => { setMusicModal(!musicModal) }}>
            <View style={styles.apnModalContainer}>
              <Pressable style={styles.apnModalContainer} onPress={() => {setMusicModal(false)}} >
                 <View style={styles.musicModalView}>
                   <TouchableOpacity   style={styles.musicModal} onPress={() => { Linking.openURL('spotify:')}}>
                     <ImageBackground
                        style={{color: "white", height: 60, width: 60, marginBottom: 0, top: 15, left: 10, flexDirection: 'row',flex: 1, position: 'absolute'}}
                        source={require("../media/spotify.png")}
                     />
                      <Text style={{fontSize: 15, fontWeight: "bold", color: "white", marginLeft: 30, right: 10, position: "absolute"}}>Open Spotify</Text>
                   </TouchableOpacity>
                   <TouchableOpacity   style={styles.musicModal}  onPress={() => { Linking.openURL('music:')}}>
                   <ImageBackground style={{color: "white", height: 60, border: 10, width: 60, marginBottom: 0, top: 15, left: 10, flexDirection: 'row',flex: 1, position: 'absolute',alignItems: 'center',
                    justifyContent: 'center'}} source={require("../media/applemusic.png")} />
                     <Text style={{fontSize: 15, fontWeight: "bold", color: "white", marginLeft: 30, right: 10, position: "absolute"}}>Open Apple Music</Text>
                   </TouchableOpacity>
                   <TouchableOpacity  style={styles.closeApnModal} onPress={() => { setMusicModal(false)}} >
                     <Text style={{fontWeight: "bold", color: "white", fontSize: 20}}>Close</Text>
                   </TouchableOpacity>
                 </View>
             </Pressable>
           </View>
         </Modal>
         <Modal
           transparent={false}
           animationType="slide"
           visible={startWorkout}>
              <View style={{backgroundColor: "black", alignItems: 'center', color: "black", justifyContent: 'center', height: 700,
                 padding: 4}}>
                <Text style={{color: "white", paddingBottom: 60, fontSize: 30}}> Workout Starting In...</Text>
                 <CountdownCircleTimer
                   isPlaying={startWorkout}
                   duration={3}
                   colors={['#FC3A00']}
                   onComplete={beginWorkout}>
                   {({ remainingTime }) => <Text style={{color: "white", fontSize: 30}}>{remainingTime}</Text>}
                 </CountdownCircleTimer>
                </View>
                <View style={{backgroundColor: "black", alignItems: 'center', color: "black", justifyContent: 'center', height: 400, padding: 4}}>
                </View>
         </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#402583',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
    borderRadius: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  topBar: {
    marginTop: 20,
    marginLeft: 20,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 35,
    fontWeight: "bold",
    fontFamily: "System",
  },
  description: {
    color: 'white',
    marginTop: 10,
    marginLeft: 15,
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "System",
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: 'contain',
    borderRadius: 54 / 2,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 330,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    position: "absolute",
  },
  buttonStart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#D6B22E',
    marginTop: 10,
    marginBottom: 30,
    marginLeft: 40,
    marginRight: 40
  },
  openSettings: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 22,
  },
  closeApnModal: {
    alignItems: 'center',
    backgroundColor: "black",
    height: 55,
    shadowRadius: 4,
    elevation: 1,
    width: 200,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 22,
    marginTop: 35,
  },
  musicModal: {
    alignItems: 'center',
    backgroundColor: "black",
    height: 100,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
    width: 200,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 22,
    marginTop: 35,
  },
  apnModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowOpacity: 0.25,
  },
  musicModalView: {
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
  scheduleModalView: {
    margin: 20,
    backgroundColor: "black",
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
  apnModalView: {
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
  scheduleConfirmModalView: {
    margin: 20,
    backgroundColor: "#2F2D2D",
    borderRadius: 20,
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: ScreenWidth/1.5,
    height: ScreenWidth/1.5
  }
});

export default WorkoutSelected;

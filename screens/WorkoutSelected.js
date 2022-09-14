import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Button, Image, Dimensions, ScrollView, SafeAreaView, Linking,Pressable, Share,
          StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated, StatusBar, ImageBackground } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import DatePicker from 'react-native-date-picker';
const moment = require('moment');

import ThumbnailImage from '../components/ThumbnailImage.js';
import VideoComponent from '../components/VideoComponent.js';
import Video from 'react-native-video';
var RNFS = require("react-native-fs");
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutContent from "../components/WorkoutContent.js";

const HEADER_MAX_HEIGHT = 340;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

//var path = RNFS.ExternalDirectoryPath + "/abc.png";
const WorkoutSelected = ({navigation, route, uid}) => {

  const title = route.params[0].title;
  const image = route.params[0].image;
  const time = route.params[0].time;
  const content = route.params[0].content;

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exerciseContent, setExerciseContent] = useState([]);
  const [videoFile, setVideoFile] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [apnDisabled, setApnDisabled] = useState(false);
  const [musicModal, setMusicModal] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const workoutSelectedData = async () => {

    console.log('loading');
    setLoading(false);

    const filenamecontent = await getExerciseById();
    console.log('starting to download')

    await rnfsDownload(filenamecontent);
    console.log('finsihed to download ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
  }

  const getExerciseById = async () => {

    console.log('calling getExerciseById ...')
    const exerciseArray = [];
    for (let i = 0; i < content.length; i++)
    {
      const exerciseid = content[i]['exerciseid'];
      console.log('going to get the exercises by id ')
      const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");

      const response = await fetch(`https://hautewellnessapp.com/api/getExerciseById?exerciseid=${exerciseid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({"id_token": storageToken})
        });

      // TODO: add error messages
      const data = await response.json();
      console.log('data');
      console.log(data);
      content[i]['filename'] = data[0]['filename'];
      content[i]['name'] = data[0]['name'];
      exerciseArray.push(content[i]);
    }
    setExerciseList(exerciseArray);
    return content;
  };

  const beginWorkout = () => {

    const apiParams = {};
    apiParams['title'] = title;
    apiParams['exerciseList'] = exerciseList;
    navigation.navigate('WorkoutCourse', [apiParams]);
  }

  const rnfsDownload = async (content) => {

    console.log('inside rnfsDownload')
    console.log(content);
    console.log('\n\n')
    var path = RNFS.DocumentDirectoryPath + '/hwtest.mp4';
    console.log(RNFS.DocumentDirectoryPath)
    console.log('content', content);

    for (let i = 0; i < content.length; i++)
    {
      const row = content[i];
      console.log('row')
      console.log(row)
      const path = RNFS.DocumentDirectoryPath + `/${row['exerciseid']}.mp4`;
      if (await RNFS.exists(path))
      {
          console.log(`\n\n         PATH ${path} EXISTS       !!!\n\n`);
        //  RNFS.unlink(path)
          continue;
      }
      else {
        console.log(`PATH ${path}  DOES NOT EXISTS`);

        let filename = row['filename'].replace(/\s/, "%20");
        console.log(row['filename']);
        filename = row['filename'].replace(/\s/, "%20");

        console.log('now downloading: ', filename);
        const downloadInfo = await RNFS.downloadFile({ fromUrl: filename, toFile: path });
        if (await downloadInfo.promise) { console.log('downloaded : D') }
      }
    }
    console.log('done with all downloads!!')
  }

  useEffect(() => {
    workoutSelectedData();
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

  const backgroundImage = require("../media/lifting.jpeg");

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
        const result = await Share.share({
          message:
            'Check out Haute Wellness',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
  }

  const openScheduleWorkoutModal = () => {

    PushNotificationIOS.checkPermissions(Localarray => {
        if (Localarray['authorizationStatus'] != 2) setApnDisabled(true);
        if (Localarray['authorizationStatus'] == 2) setOpen(true);
    });
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
          <WorkoutContent navigation={navigation} route={route} content={content}/>
        </Animated.ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
          <Animated.Image style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]} source={require("../media/lifting.jpeg")} />
        </Animated.View>
        <Animated.View
         style={[
           styles.topBar,
           {
             transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
           },
         ]}>
          <Text style={styles.title}>{title}</Text>
       </Animated.View>
       <TouchableOpacity style={{width: 10, height: 10, marginBottom: 10}} style={styles.buttonStart}  onPress={beginWorkout}  >
         <Text style={{fontWeight: "bold", fontSize: 20}}>Begin Workout</Text>
       </TouchableOpacity>
      </SafeAreaView>
       <DatePicker
         modal
         mode={"time"}
         open={open}
         date={date}
         theme={"dark"}
         onConfirm={(date) => {
           setOpen(false)
           setDate(date)
           notifyPress()
         }}
         onCancel={() => {
           setOpen(false)
         }}
       />
       <Modal
         transparent={true}
         animationType="slide"
         visible={apnDisabled}
         onRequestClose={() => {
            setApnDisabled(!apnDisabled);
          }}>
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
                    <Text style={{fontWeight: "bold", color: "black", fontSize: 18}}>Close</Text>
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
          onRequestClose={() => {
             setMusicModal(!musicModal);
           }}>
            <View style={styles.apnModalContainer}>
              <Pressable style={styles.apnModalContainer} onPress={() => {setMusicModal(false)}} >
                 <View style={styles.musicModalView}>
                   <TouchableOpacity   style={styles.musicModal} onPress={() => { Linking.openURL('spotify:')}}>
                     <ImageBackground style={{color: "white", height: 60, width: 60, marginBottom: 0, top: 15, left: 10, flexDirection: 'row',flex: 1, position: 'absolute',
                        }} source={require("../media/spotify.png")} />
                      <Text style={{fontSize: 15, fontWeight: "bold", color: "white", marginLeft: 30, right: 10, position: "absolute"}}>Open Spotify</Text>
                   </TouchableOpacity>
                   <TouchableOpacity   style={styles.musicModal}  onPress={() => { Linking.openURL('music:')}}>
                   <ImageBackground style={{color: "white", height: 60, border: 10, width: 60, marginBottom: 0, top: 15, left: 10, flexDirection: 'row',flex: 1, position: 'absolute',alignItems: 'center',
                    justifyContent: 'center'}} source={require("../media/applemusic.png")} />
                     <Text style={{fontSize: 15, fontWeight: "bold", color: "white", marginLeft: 30, right: 10, position: "absolute"}}>Open Apple Music</Text>
                   </TouchableOpacity>
                 </View>
             </Pressable>
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
    marginTop: 40,
    height: 50,
    alignItems: 'center',
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
    backgroundColor: 'white',
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
    backgroundColor: "#2F2D2D",
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
  }
});

export default WorkoutSelected;

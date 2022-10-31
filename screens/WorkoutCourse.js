import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, ImageBackground, Button, TouchableOpacity, Dimensions, Modal,
  Image, Linking, StyleSheet, Pressable } from 'react-native';
import Video from 'react-native-video';
import VideoComponent from '../components/VideoComponent.js';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
var RNFS = require("react-native-fs");
import AsyncStorage from '@react-native-async-storage/async-storage';
const moment = require('moment');
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

const WorkoutCourse = ({navigation, route, setWorkoutComplete, workoutComplete}) => {

  const VideoData = route.params[0]['exerciseList'];
  const schedule_date = route.params[0]['schedule_date'];
  const workout_name = route.params[0]['title'];
//  console.log('route params ......................                CHECK')
  const pauseButton = require('../media/pauseButton.png');
  const [workoutImage, setWorkoutImage] = useState("https://d3c4ht1ghv1me9.cloudfront.net/Workout.png");
  const [titleVideo, setTitleVideo] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [workoutVideo, setWorkoutVideo] = useState(VideoData[currentNumber]['exerciseid']);
  const [totalNumber, setTotalNumber] = useState(0);
  const [videoPlayer, setVideoPlaying] = useState(0);
  const [displayButton, setDisplayButton] = useState([]);
  const [nextButton, setNextButton] = useState([]);
  const [paused, setPaused] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const [upNext, setUpNext] = useState([]);
  const [seconds, setSeconds] = useState(parseInt(VideoData[currentNumber]['seconds']));
  const [minutes, setMinutes] = useState(parseInt(VideoData[currentNumber]['minutes']));
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState((parseInt(VideoData[currentNumber]['minutes']) * 60) + parseInt(VideoData[currentNumber]['seconds']));
  const [musicModal, setMusicModal] = useState(false);
  const [endWorkoutModal, setEndWorkoutModal] = useState(false);

  useEffect(() => {

    setWorkoutVideo(VideoData[currentNumber]['exerciseid']);
    setWorkoutImage(VideoData[currentNumber]['image']);
    setTitleVideo(VideoData[currentNumber]['name']);
    setTotalNumber(VideoData.length - 1);
    setCountdownSeconds((VideoData[currentNumber]['minutes'] * 60) + VideoData[currentNumber]['seconds']);
    if (VideoData[currentNumber + 1]) setUpNext(VideoData[currentNumber + 1]['name']);

    if (paused == false) setDisplayButton(require('../media/pauseButton.png'));
    if (paused == true) setDisplayButton(require('../media/playButton.png'));
    setNextButton(require('../media/rightarrow.png'));

    if (!workoutCompleted)
    {
      const timerId = setInterval(() => tick(), 1000);
      return () => clearInterval(timerId);
    }

  }, [seconds, paused, workoutCompleted]);

  const tick = (workoutCompleted) => {

    if (workoutCompleted == true) return;
    if (paused == true) return;

    setTotalSeconds(totalSeconds + 1);

    if (totalSeconds >= 9)
    {
      setTotalSeconds(0)
      setTotalMinutes(totalMinutes + 1)
    }

    if (minutes == 0 && seconds == 0)
    {
      nextVideo();
      return;
    }
    if (minutes > 0 && (seconds == 0 || seconds < 0))
    {
      setMinutes(minutes - 1)
      setSeconds(59);
      return;
    }
    if (seconds > 0) setSeconds(seconds - 1);
  }

  const nextVideo = () => {

    setPaused(true);
    if (currentNumber >= (VideoData.length - 1))
    {
      completeWorkout();
      return;
    }

    if (!VideoData[currentNumber + 1]) return;

    setUpNext(VideoData[currentNumber + 1]['name']);
    setWorkoutVideo(VideoData[currentNumber + 1]['filename']);
    setTitleVideo(VideoData[currentNumber + 1]['title']);
    setSeconds(parseInt(VideoData[currentNumber + 1]['seconds']));
    setMinutes(parseInt(VideoData[currentNumber + 1]['minutes']));
    setCurrentNumber(currentNumber + 1);
    setDisplayButton(require('../media/pauseButton.png'));
    setPaused(false);
  }

  const completeWorkout = async () =>
  {
    setWorkoutCompleted(true);

    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    const userMetaDataString = await AsyncStorage.getItem("USER_METADATA");
    const userMetaData = JSON.parse(userMetaDataString);

    const userid = userMetaData[0]['userid'];
    const formatted_date = moment(new Date(schedule_date)).format('YYYY-MM-DD');

    let finalSeconds = totalSeconds;
    if (finalSeconds == 0) finalSeconds = '00';
    if (finalSeconds == 1) finalSeconds = '01';
    if (finalSeconds == 2) finalSeconds = '02';
    if (finalSeconds == 3) finalSeconds = '03';
    if (finalSeconds == 4) finalSeconds = '04';
    if (finalSeconds == 5) finalSeconds = '05';
    if (finalSeconds == 6) finalSeconds = '06';
    if (finalSeconds == 7) finalSeconds = '07';
    if (finalSeconds == 8) finalSeconds = '08';
    if (finalSeconds == 9) finalSeconds = '09';

    const finalTimeString = `${totalMinutes}:${finalSeconds}`;


    console.log('totalSeconds', totalSeconds);
    console.log('totalMinutes', totalMinutes);
    console.log(finalTimeString)
    setFinalTime(finalTimeString)

    const api = `https://hautewellnessapp.com/api/completeWorkout`;
    const apiParams = {};
    apiParams['userid'] = userid;
    apiParams['schedule_date'] = schedule_date;
    apiParams['id_token'] = storageToken;
    apiParams['workout_name'] = workout_name;
    apiParams['completion_time'] = finalTimeString;

    const response = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(apiParams)
    });

    // TODO: ADD ERROR LOGS
    const scheduleData = await response.json();
    setWorkoutComplete(!workoutComplete);
  };

  const pauseVideo = () => {

    if (paused == false)
    {
      setDisplayButton(require('../media/playButton.png'));
      setPaused(true);
      return;
    }
    setPaused(false);
    setDisplayButton(require('../media/pauseButton.png'));
  }

  return (
    <View style={{"backgroundColor": "black", height: 1000, paddingTop: 40}}>
      <ScrollView>
      {
        workoutCompleted == true ?
        <View style={{flexDirection: 'column', flex: 1, width: ScreenWidth, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: "white", fontSize: 44, fontWeight: "bold", textAlign: 'center', paddingTop: 130}}>Workout Completed</Text>
          <Image style={{
            height: 100,
            width: 100,
            backgroundColor: "#D6B22E",
            borderRadius: 50,
            marginTop: 70}} source={require("../media/check-mark.png")} />
            <Text style={{color: "white", fontSize: 27, fontWeight: "bold", textAlign: 'center', paddingTop: 70}}>Time: {finalTime}</Text>
            <TouchableOpacity style={{width: 10, height: 10, marginBottom: 10}} style={styles.buttonStart} onPress={() => {navigation.navigate('Workouts', [])}}  >
              <Text style={{fontWeight: "bold", fontSize: 25, fontWeight: "bold"}}>Finish Workout</Text>
            </TouchableOpacity>
        </View>
        :
        <View>
          <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingTop: 15,flex: 1, width: ScreenWidth, backgroundColor: "black" }}>
            <View style={{marginLeft: 60, marginRight:30,}}>
              <Image style={{height: 50, width: 50, marginLeft: 5}} source={require('../media/hwlogo.png')}/>
            </View>
            <Text style={{color: "white", marginLeft: 30, marginRight:30,fontSize: 35, fontWeight: "bold"}}> {totalMinutes} : {totalSeconds}</Text>
            <TouchableOpacity style={{width: 100, marginLeft: 30, marginRight:30,height: 50, alignItems: 'center',
              justifyContent: 'center'}}  onPress={() => { setMusicModal(true); setPaused(true)}}>
                <ImageBackground style={{color: "white", height: 35, width: 35,
                  justifyContent: 'center'}} source={require("../media/musicplayer.png")} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 5,flex: 1, width: ScreenWidth, backgroundColor: "black" }}>
            <Text style={{color: "white", fontWeight: "bold", fontSize:30, marginTop: 15, marginLeft: 10, width: ScreenWidth*.75, marginBottom: 10}}>{titleVideo}</Text>
            <Text style={{color: "white", fontWeight: "bold", fontSize:20, marginTop: 25, marginLeft: 15,  width: ScreenWidth*.25}}>  {currentNumber + 1} / {totalNumber + 1}</Text>
          </View>
          <VideoComponent fileName={`file://${RNFS.DocumentDirectoryPath}/${workoutVideo}.mp4`} awsLink={VideoData[currentNumber]['filename']} pausedVideo={paused}/>
            <View style={{flexDirection: 'row', paddingTop: 40, paddingLeft: 20}}>
              <View style={{width: ScreenWidth*.3}}>
                <CountdownCircleTimer
                  isPlaying={!paused}
                  duration={parseInt(countdownSeconds) + 1}
                  size={90}
                  colors={['#A30000']}
                  colorsTime={[]}
                  key={currentNumber}>
                  {
                    () => <View><TouchableOpacity onPress={pauseVideo}>
                      <ImageBackground
                        style={{height: 80, width: 80, justifyContent: 'center'}}
                        source={displayButton}>
                      </ImageBackground>
                    </TouchableOpacity></View>
                  }
                </CountdownCircleTimer>
              </View>
              <View style={{width: 100, marginTop: 50}}>
                { seconds >= 10 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : {seconds}</Text> }
                { seconds == 9 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 09 </Text> }
                { seconds == 8 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 08 </Text> }
                { seconds == 7 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 07 </Text> }
                { seconds == 6 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 06 </Text> }
                { seconds == 5 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 05 </Text> }
                { seconds == 4 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 04 </Text> }
                { seconds == 3 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 03 </Text> }
                { seconds == 2 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 02 </Text> }
                { seconds == 1 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 01 </Text> }
                { seconds == 0 && <Text style={{fontSize: 30, color: "white"}}>{minutes} : 00 </Text> }
              </View>
              {
                paused == true && currentNumber < VideoData.length - 1 &&
                <View style={{width: 100, marginTop: 50, paddingLeft: 0}}>
                  <Pressable style={{backgroundColor: "white", width: 130, height: 40, borderRadius: 16}} onPress={() => { setEndWorkoutModal(true); setPaused(true) }}>
                    <Text style={{color: "black", fontSize: 18, fontWeight: "bold", textAlign: "center", paddingTop: 10}}>End Workout</Text>
                  </Pressable>
                </View>
              }
          </View>
        <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', paddingTop: 5}}>
        {
          currentNumber < VideoData.length - 1 &&
          <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', paddingTop: 10, paddingLeft: 10}}>
            <View style={{width: ScreenWidth*.2}}>
              <Text style={{color: "white", marginLeft: 5, fontFamily: "System", fontSize: 22, marginTop: 12}}>Up Next:</Text>
            </View>
            <View style={{width: ScreenWidth*.5}}>
              <Text style={{color: "white", fontFamily: "System", fontSize: 25, marginTop: 12, marginLeft: 0}}>{upNext}</Text>
            </View>
            <View style={{width: 75, alignItems: 'center', paddingTop: 15, justifyContent: 'center'}}>
              <TouchableOpacity style={{borderRadius: 13}} onPress={nextVideo}>
                <Image style={{height: 40, width: 40, backgroundColor: "red", borderRadius: 20}} source={require("../media/nextButton.jpeg")}/>
              </TouchableOpacity>
              <Text style={{fontSize: 20, color: "white", marginTop: 10, textAlign: "center"}}>NEXT </Text>
            </View>
          </View>
        }
        {
          currentNumber == VideoData.length - 1 &&
          <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row'}}>
            <TouchableOpacity style={{width: 10, height: 10, marginBottom: 10}} style={styles.buttonStart} onPress={() => {setEndWorkoutModal(true); setPaused(true)}}  >
              <Text style={{fontWeight: "bold", fontSize: 20}}>End Workout</Text>
            </TouchableOpacity>
          </View>
        }
        </View>
      </View>
    }
    <Modal
      transparent={true}
      animationType="slide"
      visible={musicModal}
      onRequestClose={() => { setMusicModal(!musicModal); setPaused(false) }}>
        <View style={styles.apnModalContainer} onPress={() => {setMusicModal(!musicModal); setPaused(false)}}>
          <Pressable style={styles.apnModalContainer} onPress={() => {setMusicModal(!musicModal); setPaused(false)}}>
             <View style={styles.musicModalView}>
               <TouchableOpacity style={styles.musicModal} onPress={() => { Linking.openURL('spotify:')}}>
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
               <TouchableOpacity  style={styles.closeApnModal} onPress={() => { setMusicModal(false); setPaused(false)}} >
                 <Text style={{fontWeight: "bold", color: "white", fontSize: 20}}>Close</Text>
               </TouchableOpacity>
             </View>
         </Pressable>
       </View>
     </Modal>
     <Modal
       transparent={true}
       animationType="slide"
       visible={endWorkoutModal}
       onRequestClose={() => { setEndWorkoutModal(false); setPaused(false) }}>
         <View style={styles.apnModalContainer} onPress={() => {setEndWorkoutModal(false); setPaused(false)}}>
           <Pressable style={styles.apnModalContainer} onPress={() => {setEndWorkoutModal(false); setPaused(false)}}>
              <View style={styles.musicModalView}>
                <Text style={{fontSize: 28, textAlign: "center", color: "white", fontWeight: "bold", padding: 10}}>Are you sure you want to end the workout?</Text>
                <View style={{flexDirection: "row"}}>
                  <TouchableOpacity style={styles.deleteModal} onPress={() => {setEndWorkoutModal(false); setPaused(false)}}>
                    <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteModal} onPress={() => {completeWorkout(); setEndWorkoutModal(false)}}>
                    <Text style={{color: "#D6B22E", fontSize: 18, fontWeight: "bold"}}>End Workout</Text>
                  </TouchableOpacity>
               </View>
              </View>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  </View>
  )
};

const styles = StyleSheet.create({
  buttonStart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: '#D6B22E',
    marginTop: 85,
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
    height: 200,
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
  deleteModal: {
    alignItems: 'center',
    backgroundColor: "black",
    height: 50,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
    width: 135,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    marginBottom: 4,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    marginTop: 30,
  },
});

export default WorkoutCourse;

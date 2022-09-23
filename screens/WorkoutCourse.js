import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image, Linking } from 'react-native';
import Video from 'react-native-video';
import VideoComponent from '../components/VideoComponent.js';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
var RNFS = require("react-native-fs");

const WorkoutCourse = ({navigation, route}) => {

  const VideoData = route.params[0]['exerciseList'];
  const pauseButton = require('../media/pauseButton.png');
  const [workoutVideo, setWorkoutVideo] = useState([]);
  const [workoutImage, setWorkoutImage] = useState("https://d3c4ht1ghv1me9.cloudfront.net/Workout.png");
  const [titleVideo, setTitleVideo] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);
  const [videoPlayer, setVideoPlaying] = useState(0);
  const [displayButton, setDisplayButton] = useState([]);
  const [prevButton, setPrevButton] = useState([]);
  const [nextButton, setNextButton] = useState([]);
  const [paused, setPaused] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const [upNext, setUpNext] = useState([]);
  const [seconds, setSeconds] = useState(parseInt(VideoData[currentNumber]['seconds']));
  const [minutes, setMinutes] = useState(parseInt(VideoData[currentNumber]['minutes']));

  useEffect(() => {
    setWorkoutVideo(VideoData[currentNumber]['exerciseid']);
    setWorkoutImage(VideoData[currentNumber]['image']);
    setTitleVideo(VideoData[currentNumber]['name']);
    setTotalNumber(VideoData.length - 1);
    if (VideoData[currentNumber + 1]) setUpNext(VideoData[currentNumber + 1]['name']);

    if (paused == false) setDisplayButton(require('../media/pauseButton.png'));
    if (paused == true) setDisplayButton(require('../media/playButton.png'));
    setPrevButton(require('../media/leftarrow.png'));
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
/*
  const previousVideo = () => {

    if (currentNumber <= 0) return;
    setWorkoutVideo(VideoData[currentNumber - 1]['filename']);
    setWorkoutImage(VideoData[currentNumber - 1]['image']);
    setTitleVideo(VideoData[currentNumber - 1]['title'])
    setSeconds(VideoData[currentNumber - 1]['seconds'])
    setMinutes(VideoData[currentNumber - 1]['minutes'])
    setCurrentNumber(currentNumber - 1);
    setDisplayButton(require('../media/pauseButton.png'));
    setPaused(false);
  }
*/
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

  const completeWorkout = async () => {
    console.log('completed workout!')
    setWorkoutCompleted(true);

    // TODO: save completed workout in db

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
    <View style={{"backgroundColor": "black", height: 1000, paddingTop: 60}}>
    <View style={{ position:'absolute',top:45, zIndex: 100}}>
      <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Workouts', [])}>
        <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
      </TouchableOpacity>
    </View>
    <ScrollView>
    {
      workoutCompleted == true ? <Text style={{color: "white", fontSize:30, fontWeight: "bold", alignItems: 'center', justifyContent: 'center', paddingLeft: 50, paddingTop: 100,flexDirection: 'row'}}>Workout Completed ! </Text> :
      <View>
        <Text style={{color: "white", fontWeight: "bold", fontSize:30, marginTop: 12, marginLeft: 10}}>{titleVideo}</Text>
        <Text style={{color: "white", fontSize: 25}}>  {currentNumber + 1} / {totalNumber + 1}</Text>
        {
          currentNumber < VideoData.length - 1 &&
          <Text style={{color: "white", fontSize: 16, marginTop: 12, marginLeft: 10}}>Next Video: {upNext}</Text>
        }
        <VideoComponent fileName={`file://${RNFS.DocumentDirectoryPath}/${workoutVideo}.mp4`} pausedVideo={paused}/>
        <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', paddingTop: 15}}>
          { seconds >= 10 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : {seconds}</Text> }
          { seconds == 9 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 09 </Text> }
          { seconds == 8 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 08 </Text> }
          { seconds == 7 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 07 </Text> }
          { seconds == 6 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 06 </Text> }
          { seconds == 5 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 05 </Text> }
          { seconds == 4 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 04 </Text> }
          { seconds == 3 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 03 </Text> }
          { seconds == 2 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 02 </Text> }
          { seconds == 1 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 01 </Text> }
          { seconds == 0 && <Text style={{fontSize: 55, color: "white"}}>{minutes} : 00 </Text> }
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', paddingTop: 20}}>
          <TouchableOpacity onPress={pauseVideo}>
            <ImageBackground
              style={{height: 80, width: 80, padding: 10, justifyContent: 'center'}}
              source={displayButton}>
            </ImageBackground>
          </TouchableOpacity>
          {
            currentNumber < VideoData.length - 1 &&
            <TouchableOpacity style={{backgroundColor: "white", borderRadius: 13, marginLeft: 30, height: 70, width: 120, alignItems: 'center', justifyContent: 'center'}} onPress={nextVideo}>
              <Text style={{fontSize: 35, fontWeight: "bold"}}> Next </Text>
            </TouchableOpacity>
          }
          {
            currentNumber == VideoData.length - 1 &&
            <TouchableOpacity style={{backgroundColor: "white", borderRadius: 13, marginLeft: 30, height: 70, width: 120, alignItems: 'center', justifyContent: 'center'}} onPress={nextVideo}>
              <Text style={{fontSize: 35, fontWeight: "bold"}}> Next </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    }
    </ScrollView>
  </View>
  )
};

export default WorkoutCourse;

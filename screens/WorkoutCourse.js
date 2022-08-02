import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image } from 'react-native';
import Video from 'react-native-video';
import VideoComponent from '../components/VideoComponent.js';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
var RNFS = require("react-native-fs");

const WorkoutCourse = ({navigation, route, uid}) => {

  const VideoData = route.params[0]['exerciseList'];
  /*
  console.log(route.params)
  console.log('VideoData................................................');
  console.log(VideoData);
*/
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
  const [seconds, setSeconds] = useState(VideoData[currentNumber]['seconds']);
  const [minutes, setMinutes] = useState(VideoData[currentNumber]['minutes']);

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
    setSeconds(VideoData[currentNumber + 1]['seconds']);
    setMinutes(VideoData[currentNumber + 1]['minutes']);
    setCurrentNumber(currentNumber + 1);
    setDisplayButton(require('../media/pauseButton.png'));
    setPaused(false);
  }

  const completeWorkout = async () => {
    console.log('completed workout!')
    setWorkoutCompleted(true);
    /*
    try {
      const response = await fetch(`http://${url}:3000/user_progress_update?userid=${uid}&status=complete&series=${route.params[0]}`);
      const json = await response.json();

      return json;
    } catch (error) {
      console.error(error);
    }
    */
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
    <View>
    <ScrollView>
    {workoutCompleted == true ? <Text style={{color: "red", fontSize:30, alignItems: 'center', justifyContent: 'center',flexDirection: 'row'}}>Workout Completed ! </Text> :
      <View>
        <Text style={{color: "red", fontSize:30, marginTop: 12, marginLeft: 10}}>{titleVideo}</Text>
        <Text style={{fontSize: 25}}>  {currentNumber + 1} of {totalNumber + 1}</Text>
          { currentNumber < VideoData.length - 1 &&
            <Text style={{fontSize: 16, marginTop: 12, marginLeft: 10}}>Next Video: {upNext}</Text>
          }
        <VideoComponent fileName={`file://${RNFS.DocumentDirectoryPath}/${workoutVideo}.mp4`} pausedVideo={paused} style={{marginTop: 40}}/>
        <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', paddingTop: 5}}>
            <TouchableOpacity onPress={previousVideo}>
              <ImageBackground
                style={{height: 100, width: 100, padding: 10, justifyContent: 'center'}}
                source={prevButton}>
              </ImageBackground>
            </TouchableOpacity>
          <TouchableOpacity onPress={pauseVideo}>
            <ImageBackground
              style={{height: 80, width: 80, padding: 10, justifyContent: 'center'}}
              source={displayButton}>
            </ImageBackground>
          </TouchableOpacity>
          {currentNumber < VideoData.length - 1 ?
            <TouchableOpacity onPress={nextVideo}>
              <ImageBackground
                style={{height: 100, width: 100, padding: 10, justifyContent: 'center'}}
                source={nextButton}>
              </ImageBackground>
            </TouchableOpacity> : null
          }
          {currentNumber == VideoData.length - 1 ?
            <TouchableOpacity onPress={completeWorkout}>
              <ImageBackground
                style={{height: 100, width: 100, padding: 10, justifyContent: 'center'}}
                source={nextButton}>
              </ImageBackground>
            </TouchableOpacity> : null
          }
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', paddingTop: 35}}>
          <Text style={{fontSize: 35}}>{minutes} : {seconds}</Text>
        </View>
        </View>
      }
    </ScrollView>
    </View>
  )
};

export default WorkoutCourse;

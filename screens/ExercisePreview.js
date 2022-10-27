import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions, Image } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

import VideoComponent from '../components/VideoComponent.js';
var RNFS = require("react-native-fs");

const ExercisePreview = ({navigation, route}) => {

  const title = route.params[1].title;
  const image = route.params[1].image;
  const time = route.params[1].time;
  const content = route.params[1].content;

  const exerciseid = route.params[0]['exerciseid'];
  const filename = route.params[0]['filename'];

  const apiParams = {};
  apiParams['title'] = route.params[1]['params'][0].title;
  apiParams['image'] = route.params[1]['params'][0].image;
  apiParams['time'] = route.params[1]['params'][0].time;
  apiParams['json_content'] = route.params[1]['params'][0].json_content;

//  const [exerciseid, setExerciseid] = useState([]);
  const [name, setName] = useState([]);
  const [previewTime, setPreviewTime] = useState([]);

  useEffect(() => {

    console.log(route.params[0])
    setName(route.params[0]['name']);

    let seconds = route.params[0]['seconds'];
    if (seconds == '0') seconds = '00';
    if (seconds == '1') seconds = '01';
    if (seconds == '2') seconds = '02';
    if (seconds == '3') seconds = '03';
    if (seconds == '4') seconds = '04';
    if (seconds == '5') seconds = '05';
    if (seconds == '6') seconds = '06';
    if (seconds == '7') seconds = '07';
    if (seconds == '8') seconds = '08';
    if (seconds == '9') seconds = '09';

    setPreviewTime(`${route.params[0]['minutes']}:${seconds}`);
  }, []);

  return (
    <View style={{"backgroundColor": "black", height: ScreenHeight, paddingTop: 60}}>
      <View style={{ position:'absolute',top:45, zIndex: 100}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('WorkoutSelected', [apiParams])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
      </View>
      <Text style={{marginTop: 45, marginLeft: 15, fontSize: 38, fontWeight: "bold", color: "white", width: 250}}>{name}</Text>
      <Text style={{marginTop: 25, marginLeft: 15, fontSize: 28, fontWeight: "bold", color: "white", width: 250}}>{previewTime}</Text>
      <VideoComponent fileName={`file://${RNFS.DocumentDirectoryPath}/${exerciseid}.mp4`} awsLink={filename} pausedVideo={false} style={{marginTop: 30}}/>
    </View>
  )
};

export default ExercisePreview;

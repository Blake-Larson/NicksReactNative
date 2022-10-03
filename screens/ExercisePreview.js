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

  const filename = route.params[0]['filename'];
  const apiParams = {};
  apiParams['title'] = route.params[1]['params'][0].title;
  apiParams['image'] = route.params[1]['params'][0].image;
  apiParams['time'] = route.params[1]['params'][0].time;
  apiParams['json_content'] = route.params[1]['params'][0].json_content;

  const [exerciseid, setExerciseid] = useState([]);
  const [name, setName] = useState([]);

  useEffect(() => {

    setExerciseid(route.params[0]['exerciseid']);
    setName(route.params[0]['name']);
  }, []);

  return (
    <View style={{"backgroundColor": "black", height: ScreenHeight, paddingTop: 60}}>
      <View style={{ position:'absolute',top:45, zIndex: 100}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('WorkoutSelected', [apiParams])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
      </View>
      <Text style={{marginTop: 20, marginLeft: 15, fontSize: 30, fontWeight: "bold", color: "white"}}>{name}</Text>
      <VideoComponent fileName={`file://${RNFS.DocumentDirectoryPath}/${exerciseid}.mp4`} pausedVideo={false} style={{marginTop: 80}}/>
    </View>
  )
};

export default ExercisePreview;

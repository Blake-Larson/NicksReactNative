import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native';
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
  const exercise_description = route.params[0]['description'];

  const apiParams = {};
  apiParams['name'] = route.params[1]['params'][0].name;
  apiParams['image'] = route.params[1]['params'][0].image;
  apiParams['time'] = route.params[1]['params'][0].time;
  apiParams['json_content'] = route.params[1]['params'][0].json_content;
  apiParams['description'] = route.params[1]['params'][0].description;

  const [name, setName] = useState([]);
  const [previewTime, setPreviewTime] = useState([]);

  useEffect(() => {

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
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('WorkoutSelected', [apiParams])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
        <Text style={{marginTop: 0, marginLeft: 15, fontSize: 38, fontWeight: "bold", color: "white", width: 350}}>{name}</Text>
        <Text style={{marginTop: 10, marginLeft: 20, fontSize: 25, color: "white", width: 350}}>{exercise_description}</Text>
        <Text style={{marginTop: 25, marginBottom: 25, marginLeft: 15, fontSize: 28, fontWeight: "bold", color: "white", width: 250}}>{previewTime}</Text>
        <VideoComponent fileName={`file://${RNFS.DocumentDirectoryPath}/${exerciseid}.mp4`} awsLink={filename} pausedVideo={false} style={{marginTop: 30}}/>
      </ScrollView>
    </SafeAreaView>
  )
};

export default ExercisePreview;

import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image } from 'react-native';
import VideoComponent from '../components/VideoComponent.js';
var RNFS = require("react-native-fs");

const ExercisePreview = ({navigation, route, uid}) => {

  console.log('ITEM')
  console.log(route.params[0]['exerciseid'])
  console.log(route.params[0]['name'])
  const [exerciseid, setExerciseid] = useState([]);
  const [name, setName] = useState([]);

  useEffect(() => {

    setExerciseid(route.params[0]['exerciseid']);
    setName(route.params[0]['name']);
  }, []);

  return (
    <View>
      <Text style={{marginTop: 20, marginLeft: 15, fontSize: 30, fontWeight: "bold"}}>{name}</Text>
      <VideoComponent fileName={`file://${RNFS.DocumentDirectoryPath}/${exerciseid}.mp4`} pausedVideo={false} style={{marginTop: 40}}/>
    </View>
  )
};

export default ExercisePreview;

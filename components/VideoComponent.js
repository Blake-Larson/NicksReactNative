import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Modal } from 'react-native';
import Video from 'react-native-video';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const VideoComponent = ({fileName, pausedVideo, loading}) => {

  //TODO: change to loading video
  if (typeof fileName != "string") fileName = "https://fitappmedia1.s3.us-west-1.amazonaws.com/zoom.mp4";
  //if (fileName == "https://d3c4ht1ghv1me9.cloudfront.net/Squat Jump (touch-down).m4v") fileName = "https://d3c4ht1ghv1me9.cloudfront.net/Squat%20Jump%20(touch-down).m4v";
  //if (fileName == "https://d3c4ht1ghv1me9.cloudfront.net/Bosu Sump Jump.m4v") fileName = "https://d3c4ht1ghv1me9.cloudfront.net/Bosu%20Sump%20Jump.m4v";

  const [loadingVideo, setLoadingVideo] = useState(true);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const [workoutsIntermediate, setWorkoutsIntermediate] = useState([]);

  const videoReady = () => {
    console.log('video ready');
    setLoadingVideo(false);
    setHeight(200);
    setWidth(400);
  }

  return (
    <View>
    {
      loadingVideo == true &&
      <Text> L O A D I N G .... </Text>
    }
    <Video
      style={{height: height, width: width, marginTop: 10}}
      source={{uri: fileName}}
      repeat={true}
      muted={true}
      audioOnly={false}
      paused={pausedVideo}
      onReadyForDisplay={videoReady}/>
  </View>
  )
};

export default VideoComponent;

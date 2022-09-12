import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Modal } from 'react-native';
import Video from 'react-native-video';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const VideoComponent = ({fileName, pausedVideo, loading}) => {

  //TODO: change to loading video
  if (typeof fileName != "string") fileName = "https://fitappmedia1.s3.us-west-1.amazonaws.com/zoom.mp4";
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [workoutsIntermediate, setWorkoutsIntermediate] = useState([]);

  const videoReady = () => {
    console.log('video ready');
    setLoadingVideo(false);
  }

  return (
    <View style={{flexDirection: "row", padding: 10}}>
      <Video
        style={{width: ScreenWidth, height: ScreenWidth}}
        source={{uri: fileName}}
        repeat={true}
        muted={true}
        audioOnly={false}
        paused={pausedVideo}
        mixWithOthers={"mix"}
        ignoreSilentSwitch={"ignore"}
        onReadyForDisplay={videoReady}/>
  </View>
  )
};

export default VideoComponent;

import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Modal } from 'react-native';
import Video from 'react-native-video';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const VideoComponent = ({fileName, pausedVideo, loading}) => {

  //TODO: change to loading video
  if (typeof fileName != "string") fileName = "https://fitappmedia1.s3.us-west-1.amazonaws.com/zoom.mp4";
  const [loadingVideo, setLoadingVideo] = useState(true);

  const videoReady = () => {
    console.log('video ready');
  //  setLoadingVideo(false);
  }

  return (
    <View style={{flexDirection: "row"}}>
      <Video
        style={{width: ScreenWidth, height: 400, marginTop: 30}}
        source={{uri: fileName}}
        repeat={true}
        playInBackground={false}
        muted={true}
        automaticallyWaitsToMinimizeStalling={false}
        audioOnly={false}
        paused={pausedVideo}
        mixWithOthers={"mix"}
        ignoreSilentSwitch={"ignore"}/>
  </View>
  )
};

export default VideoComponent;

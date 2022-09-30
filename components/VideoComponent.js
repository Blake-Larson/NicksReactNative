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
    setLoadingVideo(false);
  }

  return (
    <View style={{flexDirection: "row"}}>
      {
        loadingVideo == true &&
        <Text style={{color: "white"}}>Loading ......</Text>
      }
      <Video
        style={{width: ScreenWidth, height: 400, marginTop: 30}}
        source={{uri: fileName}}
        repeat={true}
        playInBackground={false}
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

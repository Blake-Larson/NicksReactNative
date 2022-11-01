import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Modal } from 'react-native';
import Video from 'react-native-video';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
const RNFS = require("react-native-fs");

const VideoComponent = ({fileName, pausedVideo, loading, awsLink}) => {

  //TODO: change to loading video
  if (typeof fileName != "string") fileName = "https://fitappmedia1.s3.us-west-1.amazonaws.com/zoom.mp4";
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [awsVideo, setAwsVideo] = useState(false);

  const checkFileDownload = async () => {

    if (await RNFS.exists(fileName))
    {
      setAwsVideo(false);
    }
    else {
      setAwsVideo(true);
    }
  }


  useEffect(() => {
    checkFileDownload();
  }, []);

  return (
    <View>
    {
      awsVideo == false &&
      <View>
        <Video
          style={{width: ScreenWidth, height: 320}}
          source={{uri: fileName}}
          repeat={true}
          playInBackground={false}
          muted={true}
          audioOnly={false}
          paused={pausedVideo}
          mixWithOthers={"mix"}
          ignoreSilentSwitch={"ignore"}/>
      </View>
    }
    {
      awsVideo == true &&
      <View>
        <Video
          style={{width: ScreenWidth, height: 350}}
          source={{uri: awsLink}}
          repeat={true}
          playInBackground={false}
          muted={true}
          audioOnly={false}
          paused={pausedVideo}
          mixWithOthers={"mix"}
          ignoreSilentSwitch={"ignore"}/>
      </View>
    }
  </View>
  )
};

export default VideoComponent;

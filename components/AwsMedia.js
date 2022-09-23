import React from 'react'
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { Buffer } from 'buffer';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
const ITEM_SIZE = Dimensions.get('window').width * 0.72;

const AwsMedia = ({filename, title, json_content, status, description, day, navigation}) => {

  const content = JSON.parse(json_content);
  const apiParams = {};

  apiParams['title'] = title;
  apiParams['image'] = filename;
  apiParams['time'] = content.time;
  apiParams['status'] = status;
  apiParams['description'] = description;
  apiParams['content'] = content.course_content;
  const time = content.time;

  const backgroundStyle = {
    borderRadius: 8,
    width: "90%",
    height: "50%"
  }
  const topHeaderContainer = {
    margin: 16,
    width: "70%"
  };
  const smallTitleTextStyle = {
    fontSize: 16,
    opacity: 0.8,
    color: "#ebe8f9",
    fontWeight: "700",
    fontFamily: "System"
  };
  const largeTitleTextStyle = {
    fontSize: 32,
    opacity: 0.9,
    color: "#fffdfe",
    fontWeight: "bold",
    fontFamily: "System"
  };
  const bottomContainer = {
    left: 16,
    bottom: 16,
    width: "90%",
    position: "absolute"
  }
  const footnoteTextStyle = {
    fontSize: 12,
    color: "#fffdfe",
    fontFamily: "System"
  };
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('WorkoutSelected', [apiParams])}>
        <ImageBackground
          style={{
            width: '100%',
            height: ITEM_SIZE * 1.2,
            resizeMode: 'cover',
            borderRadius: 24,
            margin: 0,
            marginBottom: 10}}
          source={{uri: filename}}
          borderRadius={8}
          resizeMode="cover">
            <Text style={{fontSize: 30,
              position: "absolute",
              bottom: 10,
              left: 25,
              opacity: 0.9,
              color: "#fffdfe",
              fontWeight: "bold",
              fontFamily: "System" }}>{title}</Text>
            <Text style={{fontSize: 30,
              position: "absolute",
              top: 10,
              left: 15,
              opacity: 0.9,
              color: "#fffdfe",
              fontWeight: "bold",
              fontFamily: "System" }}>{day}</Text>
            <Text style={{fontSize: 15,
              position: "absolute",
              bottom: 10,
              right: 15,
              opacity: 0.9,
              color: "#fffdfe",
              fontWeight: "bold",
              fontFamily: "System" }}>{time}</Text>
            <Text style={{fontSize: 15,
              position: "absolute",
              bottom: 30,
              right: 15,
              opacity: 0.9,
              color: "#fffdfe",
              fontWeight: "bold",
              fontFamily: "System" }}>{status}</Text>
        </ImageBackground>
        <Text >{JSON.stringify(filename)}</Text>
      </TouchableOpacity>
    </View>
  )
};

export default AwsMedia;

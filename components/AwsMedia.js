import React from 'react'
import { Text, View, ImageBackground, Button, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { Buffer } from 'buffer';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");


const AwsMedia = ({filename, title, json_content, status, description, navigation}) => {

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
    <View style={{marginLeft: 25, marginTop: 5, marginBottom: 15, shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      borderRadius:15,
      shadowRadius: 5 }}
    >
      <TouchableOpacity onPress={() => navigation.navigate('WorkoutSelected', [apiParams])}>
        <ImageBackground
          style={{height: 200, width: 300, padding: 10}}
          source={{uri: filename}}
          borderRadius={8}
          resizeMode="cover">
            <Text style={{fontSize: 30,
              position: "absolute",
              bottom: 10,
              left: 15,
              opacity: 0.9,
              color: "#fffdfe",
              fontWeight: "bold",
              fontFamily: "System" }}>{title}</Text>
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
      </TouchableOpacity>
    </View>
  )
};

export default AwsMedia;

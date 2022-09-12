import { AntDesign as Icon } from "@expo/vector-icons";
import { HEADER_IMAGE_HEIGHT } from "./HeaderImage";
import { MIN_HEADER_HEIGHT } from "./Header";

const { height } = Dimensions.get("window");
import React, { useState, useEffect } from 'react';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Video from 'react-native-video';
var RNFS = require("react-native-fs");
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, Button, Image, Dimensions, ScrollView,
  StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const WorkoutContent = ({navigation, route, content}) => {

  const exercisePreview = (item) => {
    navigation.navigate('ExercisePreview', [item, route])
  }

  const loading = false;
  return (
    <View>
    {
      content.map((item, index) => (
        <View>
          <View key={index} style={{flexDirection:"row", paddingLeft: 28, paddingTop: 10}}>
            <View style={{flex: 1}}>
              <TouchableOpacity style={{}} onPress={() => exercisePreview(item)}>
                <Video
                  style={{width: "100%", marginLeft: 13}}
                  style={styles.backgroundVideo}
                  source={{uri: `file://${RNFS.DocumentDirectoryPath}/${item.exerciseid}.mp4`}}
                  paused={true}
                  />
                <Text style={{color: "white", top: 0, paddingBottom: 80, zIndex: 999}}></Text>
                <ImageBackground
                  style={{color: "white", height: 36, width: 36, opacity: .7, position: "absolute", top: 28, marginLeft: 67}}
                  source={require("../media/previewbutton.png")}>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View style={{flex:1, marginRight: 10, marginLeft: 20, marginTop: 10}}>
              <Text style={{justifyContent: 'flex-end', marginTop: 10, color: "white", fontWeight: "bold", fontSize: 15, fontFamily: "System"}}>{item.name}</Text>
              <Text style={{justifyContent: 'flex-end', marginTop: 10, color: "white"}}>{item.minutes} : {item.seconds}</Text>
            </View>
          </View>
        </View>
      ))
    }
    </View>
  )
};

const styles = StyleSheet.create({
  backgroundVideo: {
   position: 'absolute',
   top: 0,
   left: 0,
   bottom: 0,
   right: 0,
   borderRadius: 6,
 },
});

export default WorkoutContent;

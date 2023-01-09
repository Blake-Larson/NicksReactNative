import { AntDesign as Icon } from "@expo/vector-icons";
import { HEADER_IMAGE_HEIGHT } from "./HeaderImage";
import { MIN_HEADER_HEIGHT } from "./Header";

const { height } = Dimensions.get("window");
import React, { useState, useEffect } from 'react';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Video from 'react-native-video';
var RNFS = require("react-native-fs");
import { Text, View, FlatList, Button, Image, Dimensions, ScrollView,
  StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const WorkoutContent = ({navigation, route, content}) => {

  const exercisePreview = (item) => {
    navigation.navigate('ExercisePreview', [item, route])
  }

  return (
    <View>
    {
      content.map((item, index) => (
        <View key={index} style={{flexDirection:"row", paddingLeft: 28, paddingTop: 10}}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={() => exercisePreview(item)}>
              <Video
                style={{width: "100%", marginLeft: 13}}
                style={styles.backgroundVideo}
                source={{uri: `file://${RNFS.DocumentDirectoryPath}/${item.exerciseid}.mp4`}}
                paused={true}
                />
              <ImageBackground
                style={{color: "white", height: 36, width: 36, opacity: .7, position: "absolute", top: 18, marginLeft: 67}}
                source={require("../media/previewbutton.png")}>
              </ImageBackground>
              <Text style={{color: "white", top: 65, paddingBottom: 80, zIndex: 10, textAlign: "center"}}>PREVIEW</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex:1, marginRight: 5, marginLeft: 15, marginTop: 5}}>
            <Text style={{justifyContent: 'flex-end', marginTop: 10, color: "white", fontWeight: "bold", fontSize: 15}}>{item.name}</Text>
            <Text style={{justifyContent: 'flex-end', marginTop: 10, color: "white", fontSize: 12}}>Sets: {item.sets}</Text>
            <Text style={{justifyContent: 'flex-end', marginTop: 10, color: "white"}}>
              {item.minutes} {': '}
              {item.seconds == '0' && <Text style={{color: "white"}}>{'00'}</Text>}
              {item.seconds == '1' && <Text style={{color: "white"}}>{'01'}</Text>}
              {item.seconds == '2' && <Text style={{color: "white"}}>{'02'}</Text>}
              {item.seconds == '3' && <Text style={{color: "white"}}>{'03'}</Text>}
              {item.seconds == '4' && <Text style={{color: "white"}}>{'04'}</Text>}
              {item.seconds == '5' && <Text style={{color: "white"}}>{'05'}</Text>}
              {item.seconds == '6' && <Text style={{color: "white"}}>{'06'}</Text>}
              {item.seconds == '7' && <Text style={{color: "white"}}>{'07'}</Text>}
              {item.seconds == '8' && <Text style={{color: "white"}}>{'08'}</Text>}
              {item.seconds == '9' && <Text style={{color: "white"}}>{'09'}</Text>}
              {
                item.seconds != '0' &&
                item.seconds != '1' &&
                item.seconds != '2' &&
                item.seconds != '3' &&
                item.seconds != '4' &&
                item.seconds != '5' &&
                item.seconds != '6' &&
                item.seconds != '7' &&
                item.seconds != '8' &&
                item.seconds != '9' && <Text style={{color: "white"}}>{item.seconds}</Text>
              }
            </Text>
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

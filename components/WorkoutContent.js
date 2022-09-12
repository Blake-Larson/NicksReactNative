import { AntDesign as Icon } from "@expo/vector-icons";
import { HEADER_IMAGE_HEIGHT } from "./HeaderImage";
import { MIN_HEADER_HEIGHT } from "./Header";

const { height } = Dimensions.get("window");
import React, { useState, useEffect } from 'react';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Video from 'react-native-video';
var RNFS = require("react-native-fs");
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, FlatList, Button, Image, Dimensions, ScrollView, SafeAreaView, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

const WorkoutContent = ({navigation, route, content}) => {

  const exercisePreview = (item) => {
    navigation.navigate('ExercisePreview', [item, route])
  }

  const loading = false;
  return (
    <View>
    {
      loading == false && content.map((item, index) => (
        <View>
        <View key={index} style={{flexDirection:"row", paddingLeft: 28, paddingTop: 10}}>
          <Video
            style={{height: 130, width: 180, marginBottom: 1}}
            source={{uri: `file://${RNFS.DocumentDirectoryPath}/${item.exerciseid}.mp4`}}
            paused={true}
          />
          <View style={{flex:2, marginRight: 10, marginLeft: 20, marginTop: 10}}>
            <Text style={{justifyContent: 'flex-end', marginTop: 10, color: "white", fontWeight: "bold"}}>{item.name}</Text>
            <Text style={{justifyContent: 'flex-end', marginTop: 10, color: "white"}}>{item.minutes} : {item.seconds}</Text>
            <TouchableOpacity style={{width: 10, height: 10}} style={styles.button} onPress={() => exercisePreview(item)} >
              <Text style={styles.text}>PREVIEW</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      ))
    }
    </View>
  )
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "red",
    paddingTop: 50,
    margin: 60,
  },
  modalView: {
    margin: 60,
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'grey',
    marginTop: 10,
    marginRight: 30
  },
  buttonStart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30
  },
  text: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: 'bold',
    letterSpacing: 0.15,
    color: 'white',
  },
});

export default WorkoutContent;

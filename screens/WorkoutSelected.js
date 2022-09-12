import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Button, Image, Dimensions, ScrollView, SafeAreaView,
          StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated, StatusBar, ImageBackground } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import ThumbnailImage from '../components/ThumbnailImage.js';
import VideoComponent from '../components/VideoComponent.js';
import Video from 'react-native-video';
var RNFS = require("react-native-fs");
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutContent from "../components/WorkoutContent.js";

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

//var path = RNFS.ExternalDirectoryPath + "/abc.png";
const WorkoutSelected = ({navigation, route, uid}) => {

  const title = route.params[0].title;
  const image = route.params[0].image;
  const time = route.params[0].time;
  const content = route.params[0].content;

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exerciseContent, setExerciseContent] = useState([]);
  const [videoFile, setVideoFile] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const workoutSelectedData = async () => {

    console.log('loading');
    setLoading(false);

    const filenamecontent = await getExerciseById();
    console.log('starting to download')

    await rnfsDownload(filenamecontent);
    console.log('finsihed to download ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
  }

  const getExerciseById = async () => {

    console.log('calling getExerciseById ...')
    const exerciseArray = [];
    for (let i = 0; i < content.length; i++)
    {
      const exerciseid = content[i]['exerciseid'];
      console.log('going to get the exercises by id ')
      const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");

      const response = await fetch(`https://hautewellnessapp.com/api/getExerciseById?exerciseid=${exerciseid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({"id_token": storageToken})
        });

      // TODO: add error messages
      const data = await response.json();
      console.log('data');
      console.log(data);
      content[i]['filename'] = data[0]['filename'];
      content[i]['name'] = data[0]['name'];
      exerciseArray.push(content[i]);
    }
    setExerciseList(exerciseArray);
    return content;
  };

  const beginWorkout = () => {

    const apiParams = {};
    apiParams['title'] = title;
    apiParams['exerciseList'] = exerciseList;
    navigation.navigate('WorkoutCourse', [apiParams]);
  }

  const rnfsDownload = async (content) => {

    console.log('inside rnfsDownload')
    console.log(content);
    console.log('\n\n')
    var path = RNFS.DocumentDirectoryPath + '/hwtest.mp4';
    console.log(RNFS.DocumentDirectoryPath)
    console.log('content', content);

    for (let i = 0; i < content.length; i++)
    {
      const row = content[i];
      console.log('row')
      console.log(row)
      const path = RNFS.DocumentDirectoryPath + `/${row['exerciseid']}.mp4`;
      if (await RNFS.exists(path))
      {
          console.log(`\n\n         PATH ${path} EXISTS       !!!\n\n`);
        //  RNFS.unlink(path)
          continue;
      }
      else {
        console.log(`PATH ${path}  DOES NOT EXISTS`);

        let filename = row['filename'].replace(/\s/, "%20");
        console.log(row['filename']);
        filename = row['filename'].replace(/\s/, "%20");

        console.log('now downloading: ', filename);
        const downloadInfo = await RNFS.downloadFile({ fromUrl: filename, toFile: path });
        if (await downloadInfo.promise) { console.log('downloaded : D') }
      }
    }
    console.log('done with all downloads!!')
  }

  useEffect(() => {
    workoutSelectedData();
  }, []);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 3, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.9],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: 'clamp',
  });

  const backgroundImage = require("../media/lifting.jpeg");

  return (
    <View style={{flex: 1}}>
      <View style={{ position:'absolute',top:45, zIndex: 100}}>
        <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('Workout', [])}>
          <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.saveArea}>
        <Animated.ScrollView
          contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT - 32 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY }}}],
            { useNativeDriver: true },
          )}>
          <WorkoutContent navigation={navigation} route={route} content={content}/>
        </Animated.ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
          <Animated.Image style={[
            styles.headerBackground,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]} source={require("../media/lifting.jpeg")} />
        </Animated.View>
        <Animated.View
         style={[
           styles.topBar,
           {
             transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
           },
         ]}>
          <Text style={styles.title}>{title}</Text>
       </Animated.View>
       <TouchableOpacity style={{width: 10, height: 10, marginBottom: 20}} style={styles.buttonStart}  onPress={beginWorkout}  >
         <Text style={{fontWeight: "bold", fontSize: 20}}>Begin Workout</Text>
       </TouchableOpacity>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#402583',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,

  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  topBar: {
    marginTop: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 35,
    fontWeight: "bold",
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: 'contain',
    borderRadius: 54 / 2,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 330,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    position: "absolute",
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
    marginBottom: 30,
    marginLeft: 40,
    marginRight: 40
  },
});

export default WorkoutSelected;

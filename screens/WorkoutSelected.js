import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, Image, Dimensions, ScrollView, SafeAreaView, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import ThumbnailImage from '../components/ThumbnailImage.js';
import VideoComponent from '../components/VideoComponent.js';
import Video from 'react-native-video';
var RNFS = require("react-native-fs");

//var path = RNFS.ExternalDirectoryPath + "/abc.png";

const WorkoutSelected = ({navigation, route, uid}) => {

  const title = route.params[0].title;
  const image = route.params[0].image;
  const time = route.params[0].time;
  const content = route.params[0].content;

  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseContent, setExerciseContent] = useState([]);
  const [videoFile, setVideoFile] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);

  const workoutSelectedData = async () => {

    const filenamecontent = await getExerciseById();
    rnfsDownload(filenamecontent);
  }

  const getExerciseById = async () => {

    console.log('calling getExerciseById ...')
    const exerciseArray = [];
    for (let i = 0; i < content.length; i++)
    {
      const exerciseid = content[i]['exerciseid'];
      const api = `https://hautewellnessapp.com/api/getExerciseById?exerciseid=${exerciseid}`;
      const response = await fetch(api);
      const data = await response.json();
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
      console.log('\nexrcise list')
      console.log(content)
      for (let i = 0; i < content.length; i++)
      {
        const row = content[i];
        console.log('row')
        console.log(row)
        const path = RNFS.DocumentDirectoryPath + `/${row['exerciseid']}.mp4`;
        if (await RNFS.exists(path)){
            console.log(`\n\n         PATH ${path} EXISTS       !!!\n\n`);
            continue;
        }
        else {
          console.log(`PATH ${path}  DOES NOT EXISTS`);

          const filename = row['filename'];
          console.log(filename);
          const downloadInfo = await RNFS.downloadFile({
            fromUrl: filename,
            toFile: path,
            //headers: getOpts.headers,
          })
          if (await downloadInfo.promise) {
            console.log('downloaded : D')
          }
        }
      }
    }

    useEffect(() => {
      workoutSelectedData();
    }, []);

    const exercisePreview = (item) => {
      console.log('ex prev')
      navigation.navigate('ExercisePreview', [item])
    }

  return (
    <ScrollView>
      <Text>{route.params[0].title}</Text>
      <Image
        style={{height: 200, width: ScreenWidth}}
        source={{uri: image}}>
      </Image>
      {content.map((item, index) => (
        <View key={index} style={{flexDirection:"row"}}>
          <View style={{flex:1}}>
            <TouchableOpacity style={{justifyContent: 'flex-start', marginTop: 20}} image={image} onPress={() => exercisePreview(item)} >
              <ThumbnailImage image={image}/>
            </TouchableOpacity>
          </View>
          <View style={{flex:2, marginRight: 20}}>
            <Text style={{justifyContent: 'flex-end', marginTop: 20}}>Name: {item.name}</Text>
            <Text style={{justifyContent: 'flex-end', marginTop: 20}}>Minutes: {item.minutes}</Text>
            <Text style={{justifyContent: 'flex-end', marginTop: 20}}>Seconds: {item.seconds}</Text>
            <Text style={{justifyContent: 'flex-end', marginTop: 20}}>{JSON.stringify(item)}</Text>
          </View>
        </View>
      ))}
      <Button title="Begin" onPress={beginWorkout}></Button>
        <Modal
          style={styles.centeredView}
          transparent={true}
          visible={modalVisible}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={{flex:2,backgroundColor:'#6666669c'}}>
               <VideoComponent fileName={videoFile} pausedVideo={false} style={{marginTop: 40}}/>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
    </ScrollView>
  )
}

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

});

export default WorkoutSelected;
/*
  return fetch(api)
    .then((response) => response.json())
    .then((json) => {
      console.log('EXERCISE JSON..')
      console.log(json);
      setExerciseContent(json)
      setVideoFile(json[0]['filename'])
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
    */

/*
  const getWorkoutSelected = () => {
  return fetch(`http://${url}:3000/user_series_progress?userid=${uid}&series=${title}`)
    .then((response) => response.json())
    .then((json) => {
      setExerciseContent(json)
      console.log(json);
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
  };
  */


/*
  const completeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user_progress_update?userid=${uid}&status=complete&series=${title}`);
      const json = await response.json();
      getWorkoutSelected();
      return json;
    } catch (error) {
      console.error(error);
    }
  };
*/
/*
  const resetStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user_progress_reset?userid=${uid}&series=${title}`);
      const json = await response.json();
      getWorkoutSelected();
      return json;
    } catch (error) {
      console.error(error);
    }
  };
*/

//    console.log('yeah it doesnt exist here')

    /*
    RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      console.log('GOT RESULT', result);

      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }
      console.log('no file...')
      return 'no file';
    })
    .then((contents) => {
      // log the file contents
      console.log(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });*/

/*
    const downloadInfo = await RNFS.downloadFile({
      fromUrl: "https://d3c4ht1ghv1me9.cloudfront.net/Bosu%20Sump%20Jump.m4v",
      toFile: path,
      //headers: getOpts.headers,
    })
    if (await downloadInfo.promise) {
      // ASSET HAS BEEN DOWNLOADED!
      console.log('downloaded : D')
    }

    */

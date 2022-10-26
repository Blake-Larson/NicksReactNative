import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Button, ScrollView, Dimensions, TouchableOpacity,
  ImageBackground, StyleSheet, Pressable, Modal, Image } from 'react-native';
import AwsMedia from '../components/AwsMedia';
import WorkoutSelected from './WorkoutSelected';
import Paywall from '../components/Paywall';
//import { useIsFocused } from "@react-navigation/native";
import WeeklyIcon from '../components/WeeklyIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
const moment = require('moment');
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const ITEM_SIZE = Dimensions.get('window').width * 0.9;
const SPACING = 6;
const RNFS = require("react-native-fs");

const Workouts = ({navigation, paywallShown, setPaywallShown, subInfo, setSubInfo, completedWorkouts}) => {

//  const isFocused = useIsFocused();

  const ref = useRef(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState([]);
  const [startingDate, setStartingDate] = useState([]);
  const [dateIndex, setDateIndex] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cacheDate, setCacheDate] = useState(new Date());

  const getWorkouts = async () => {

    const initialIndex = new Date().getDay() - 1;
    if (initialIndex >= 0) setDateIndex(initialIndex);
    if (initialIndex < 0) setDateIndex(6);

    const date = new Date("9/5/2022");
    const mon = moment(date).isoWeekday(1).format('YYYY-MM-DD');
    const tues = moment(date).isoWeekday(2).format('YYYY-MM-DD')
    const wed = moment(date).isoWeekday(3).format('YYYY-MM-DD');
    const thurs = moment(date).isoWeekday(4).format('YYYY-MM-DD');
    const fri = moment(date).isoWeekday(5).format('YYYY-MM-DD');
    const sat = moment(date).isoWeekday(6).format('YYYY-MM-DD');
    const sun = moment(date).isoWeekday(7).format('YYYY-MM-DD');
    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");

    const api = `https://hfezr9j0sk.execute-api.us-west-1.amazonaws.com/default/testapi/`;
    const apiParams = {};
    apiParams['monday'] = mon;
    apiParams['tuesday'] = tues;
    apiParams['wednesday'] = wed;
    apiParams['thursday'] = thurs;
    apiParams['friday'] = fri;
    apiParams['saturday'] = sat;
    apiParams['sunday'] = sun;
    apiParams['id_token'] = storageToken;

    const response = await fetch(api, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'same-origin',
     body: JSON.stringify(apiParams)
    });
    const scheduleData = await response.json();

    const weekday = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"];
    const workoutWeek = [];

    for (let i = 0; i < scheduleData.body.length; i++)
    {
      const newKvt = [];
      const row = scheduleData.body[i];
      const d = new Date(row['schedule_date']);
      let day = weekday[d.getDay()];

      const weeklyObj = {};
      weeklyObj['day'] = day;
      weeklyObj['workoutid'] = row['workoutid'];
      weeklyObj['schedule_date'] = row['schedule_date'];
      weeklyObj['name'] = row['name'];
      weeklyObj['filename'] = row['filename'];
      weeklyObj['json_content'] = row['json_content'];

      workoutWeek.push(weeklyObj);
    }
    setWorkouts(workoutWeek)

/*
  //API GATEWAY -> LAMBDA EXAMPLE
    const api2 = `https://1tykl3w05h.execute-api.us-west-1.amazonaws.com/default/getWorkoutsThisWeek`;
    const response2 = await fetch(api2, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'same-origin',
    });
    const jsonTest = await response2.json();
    console.log('output 2', jsonTest)
*/
  };

  useEffect(() => {
    console.log('here....')
    getWorkouts();
    const now = moment();
    const dateSelected = moment();
    const newDate = dateSelected.format('MM-DD-YYYY');

    setStartingDate(dateSelected);
    cleanUpCache();
    return () => {};
  }, []);

  const cleanUpCache = () => {

    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then(result => {
        for (let i = 0; i < result.length; i++)
        {
          const cacheDate = result[i]['mtime'];
          const cacheDateFormat = new Date();
          const cacheDateStale = new Date(cacheDateFormat.setDate(cacheDateFormat.getDate() - 3));
          if (result[i]['mtime'] < cacheDateStale) console.log('yooooooooooooooo                          OLD')
          if (result[i]['mtime'] < cacheDateStale) RNFS.unlink(result[i]['path'])
        }
      });
  }


  const checkPaywall = async (item) => {

    if (paywallShown == true) setModalVisible(true)
    if (paywallShown == true) return;

    navigation.navigate('WorkoutSelected', [item]);
  }


  const getItemLayout = (data, index) => {(
    {length: ITEM_SIZE, offset: ITEM_SIZE * index, index}
  )}

  const scrollFlatListIndex = (index) => {
    ref.current.scrollToIndex({"index": index})
  }

  return (
    <View style={{"backgroundColor": "black", height: 1000, paddingTop: 60}}>
      <ScrollView>
        <Text style={{fontWeight: "bold", fontFamily: "System", fontSize: 35, paddingLeft: 25, color: "white", paddingBottom: 15}}>Haute Wellness</Text>
          <View style={{flexDirection: 'row', flex: 1, width: ScreenWidth, paddingBottom: 10, alignItems: 'center', justifyContent: 'center'}}>
            <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={0} weekday={"M"} scrollFlatListIndex={scrollFlatListIndex}/>
            <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={1} weekday={"T"} scrollFlatListIndex={scrollFlatListIndex}/>
            <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={2} weekday={"W"} scrollFlatListIndex={scrollFlatListIndex}/>
            <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={3} weekday={"T"} scrollFlatListIndex={scrollFlatListIndex}/>
            <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={4} weekday={"F"} scrollFlatListIndex={scrollFlatListIndex}/>
            <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={5} weekday={"S"} scrollFlatListIndex={scrollFlatListIndex}/>
            <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={6} weekday={"S"} scrollFlatListIndex={scrollFlatListIndex}/>
          </View>
          <FlatList
            ref={ref}
            showsHorizontalScrollIndicator={false}
            data={workouts}
            horizontal
            initialScrollIndex={dateIndex}
            getItemLayout={(data, index) => { return {length: ITEM_SIZE, offset: ITEM_SIZE * index, index} }}
            renderItem={({ item, index: dateIndex }) => (
              <View style={{width: ITEM_SIZE}}>
                <View style={{marginHorizontal: SPACING, padding: SPACING, borderRadius: 34}}>
                  <TouchableOpacity onPress={() => {checkPaywall(item)}}>
                    <ImageBackground
                      style={styles.posterImage}
                      source={{uri: item.filename}}
                      borderRadius={8}>
                        <Text
                          style={{fontSize: 35,
                          position: "absolute",
                          bottom: 10,
                          left: 25,
                          opacity: 0.9,
                          color: "#fffdfe",
                          fontWeight: "bold",
                          fontFamily: "System" }}>
                          {item.name}
                        </Text>
                        <Text style={{fontSize: 25,
                          position: "absolute",
                          top: 10,
                          left: 15,
                          opacity: 0.9,
                          color: "#fffdfe",
                          fontWeight: "bold",
                          fontFamily: "System" }}>{item.day}</Text>
                        {
                          paywallShown == true &&
                          <Image style={{position: "absolute",
                            top: 15,
                            right: 30,
                            height: 30,
                            width: 30 }} source={require("../media/padlock.png")} />
                        }
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <Modal
           animationType="slide"
           transparent={true}
           visible={modalVisible}
           onRequestClose={() => { setModalVisible(!modalVisible)}}>
             <View style={[styles.centeredView]}>
               <View style={styles.modalView}>
                 <Pressable
                   style={[styles.button, styles.buttonClose]}
                   onPress={() => setModalVisible(!modalVisible)}>
                   <Text style={styles.textStyle}>X</Text>
                 </Pressable>
                 <Paywall subInfo={subInfo} setSubInfo={setSubInfo} paywallShown={paywallShown} setPaywallShown={setPaywallShown} />
               </View>
             </View>
           </Modal>
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    height: '100%',
    marginTop: '40%',
    backgroundColor: "#4D504F",
    borderRadius: 20,
    paddingTop: 35,
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: "absolute",
    top: 10,
    right: 15,
    opacity: 0.9,
    color: "#fffdfe",
    fontWeight: "bold",
    fontFamily: "System"
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "white",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    padding: 30
  }
});

export default Workouts;

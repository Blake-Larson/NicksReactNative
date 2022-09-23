import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ScrollView, Dimensions, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import AwsMedia from '../components/AwsMedia';
import WorkoutSelected from './WorkoutSelected';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarStrip from 'react-native-calendar-strip';
const moment = require('moment');

const ITEM_SIZE = Dimensions.get('window').width * 0.9;
const SPACING = 6;

const Workouts = ({navigation}) => {

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState([]);
  const [startingDate, setStartingDate] = useState([]);
  //onDateSelected(dateSelected);

  const getWorkouts = async () => {

    const date = new Date("9/5/2022");
    const mon = moment(date).isoWeekday(1).format('YYYY-MM-DD');
    const tues = moment(date).isoWeekday(2).format('YYYY-MM-DD')
    const wed = moment(date).isoWeekday(3).format('YYYY-MM-DD');
    const thurs = moment(date).isoWeekday(4).format('YYYY-MM-DD');
    const fri = moment(date).isoWeekday(5).format('YYYY-MM-DD');
    const sat = moment(date).isoWeekday(6).format('YYYY-MM-DD');
    const sun = moment(date).isoWeekday(7).format('YYYY-MM-DD');

    const api = `https://hautewellnessapp.com/api/getWorkoutsThisWeek?thursday=${thurs}&tuesday=${tues}&wednesday=${wed}&friday=${fri}&saturday=${sat}&monday=${mon}&sunday=${sun}`;

    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    const response = await fetch(api, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'same-origin',
     body: JSON.stringify({"id_token": storageToken})
    });
    const scheduleData = await response.json();

    const weekday = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday", "Sunday"];
    const workoutWeek = [];

    for (let i = 0; i < scheduleData.length; i++)
    {
      const response = await fetch(`https://hautewellnessapp.com/api/getWorkoutById?workoutid=${scheduleData[i]['workoutid']}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({"id_token": storageToken})
      });
      const data = await response.json();
      const newKvt = [];
      const d = new Date(scheduleData[i]['schedule_date']);
      let day = weekday[d.getDay()];

      const weeklyObj = {};
      weeklyObj['day'] = day;
      weeklyObj['workoutid'] = scheduleData[i]['workoutid'];
      weeklyObj['schedule_date'] = scheduleData[i]['schedule_date'];

      weeklyObj['name'] = data[0]['name'];
      weeklyObj['filename'] = data[0]['filename'];
      weeklyObj['json_content'] = data[0]['json_content'];

      workoutWeek.push(weeklyObj);
    }

    setWorkouts(workoutWeek)
  };

  useEffect(() => {
    getWorkouts();
    const now = moment();
    const dateSelected = moment();
    const newDate = dateSelected.format('MM-DD-YYYY');

    setStartingDate(dateSelected);
  }, []);


  const getItemLayout = (data, index) => {(
    {length: ITEM_SIZE, offset: ITEM_SIZE * index, index}
  )}

  return (
    <View style={{"backgroundColor": "black", height: 1000, paddingTop: 60}}>
      <ScrollView>
        <Text style={{fontWeight: "bold", fontFamily: "System", fontSize: 35, paddingLeft: 25, color: "white", paddingBottom: 15}}>Haute Wellness</Text>
          <CalendarStrip
            showMonth={false}
            showDay={false}
            scrollable={false}
            showDayNumber={true}
            calendarHeaderStyle={{color: 'white'}}
            dateNumberStyle={{color: 'white'}}
            dateNameStyle={{color: 'white'}}
            highlightDateNumberStyle={{color: 'white'}}
            highlightDateNameStyle={{color: 'white'}}
            disabledDateNameStyle={{color: 'white'}}
            disabledDateNumberStyle={{color: 'white'}}
            scrollerPaging={true}
            leftSelector={[]}
            rightSelector={[]}
            style={{paddingLeft: 25, paddingRight: 25, paddingTop: 15, paddingBottom: 25}}
          />
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={workouts}
            horizontal
            initialScrollIndex={3}
            getItemLayout={(data, index) => { return {length: ITEM_SIZE, offset: ITEM_SIZE * index, index} }}
            renderItem={({ item }) => (
              <View style={{width: ITEM_SIZE}}>
                <View style={{marginHorizontal: SPACING,
                  padding: SPACING,
                  borderRadius: 34}}>
                  <TouchableOpacity onPress={() => navigation.navigate('WorkoutSelected', [item])}>
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
                          fontFamily: "System" }}>{item.name}</Text>
                        <Text style={{fontSize: 25,
                          position: "absolute",
                          top: 10,
                          left: 15,
                          opacity: 0.9,
                          color: "#fffdfe",
                          fontWeight: "bold",
                          fontFamily: "System" }}>{item.day}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
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
});

export default Workouts;

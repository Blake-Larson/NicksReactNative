import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ScrollView } from 'react-native';
import AwsMedia from '../components/AwsMedia';
import WorkoutSelected from './WorkoutSelected';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarStrip from 'react-native-calendar-strip';
const moment = require('moment');

const Workouts = ({navigation}) => {

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState([]);
  const [startingDate, setStartingDate] = useState([]);
  //onDateSelected(dateSelected);

  const getWorkouts = async () => {

    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    const response = await fetch(`https://hautewellnessapp.com/api/getWorkouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({"id_token": storageToken})
    });
    const data = await response.json();

    console.log('data', data)
    const newKvt = [];
    newKvt.push(data[0]);
    newKvt.push(data[0]);
    setWorkouts(newKvt);
  };

  useEffect(() => {
    getWorkouts();
    const now = moment();
    const dateSelected = moment();
    const newDate = dateSelected.format('MM-DD-YYYY');

  //  setWrittenDate(now.format('ll'))
    setStartingDate(dateSelected);
    console.log(dateSelected)
  }, []);

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
            horizontal
            showsHorizontalScrollIndicator={false}
            data={workouts}
            renderItem={({ item }) => (
              <AwsMedia filename={item.filename} title={item.name} json_content={item.json_content} description={item.description} status={item.status} navigation={navigation}></AwsMedia>
            )}
          />
      </ScrollView>
    </View>
  )
};

export default Workouts;

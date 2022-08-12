import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ScrollView } from 'react-native';
import AwsMedia from '../components/AwsMedia';
import WorkoutSelected from './WorkoutSelected';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Item = ({ filename }) => (
  <View>
    <Text>{filename}</Text>
  </View>
);

const Workouts = ({navigation, uid}) => {

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState([]);

  const getWorkouts = async () => {

    console.log('going to get the workouts ')
    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    console.log(storageToken)
    const response = await fetch(`https://hautewellnessapp.com/api/getWorkouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({"id_token": storageToken})
      });

      console.log(response)

    //const api = `http://localhost:3000/api/getWorkouts`;
    //const response = await fetch(api);
    const data = await response.json();
    console.log(data);
    setWorkouts(data);
  };

  useEffect(() => {
    getWorkouts();
  }, []);

  return (
    <View>
    <ScrollView>
      <Text style={{fontWeight: "bold", fontFamily: "System", fontSize: 30, paddingLeft: 25}}>All Workouts</Text>
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

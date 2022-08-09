import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ScrollView } from 'react-native';
import AwsMedia from '../components/AwsMedia';
import WorkoutSelected from './WorkoutSelected';

const Item = ({ filename }) => (
  <View>
    <Text>{filename}</Text>
  </View>
);

const Workouts = ({navigation, uid}) => {

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState([]);

  const getWorkouts = async () => {
    
    const api = `https://hautewellnessapp.com/api/getWorkouts`;
    const response = await fetch(api);
    const data = await response.json();
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

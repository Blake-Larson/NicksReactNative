import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Modal, Pressable } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const WeeklyIcon = ({completedWorkouts, setDateIndex, dateIndex, componentIndex, weekday, scrollFlatListIndex}) => {

  return (
    <Pressable style={{ width: ScreenWidth / 7, alignItems: 'center'}} onPress={() => {setDateIndex(componentIndex);  scrollFlatListIndex(componentIndex)}}>
    {
      completedWorkouts.includes(componentIndex) ?
      <Image style={{
        height: 33,
        backgroundColor: "#D6B22E",
        borderRadius: 22,
        width: 33, borderWidth: 3,
        borderColor: dateIndex == componentIndex ? "white" : "black"
        }} source={require("../media/check-mark.png")} />
        :
        <Text style={{color: "white", fontSize: 23, fontWeight: "bold", textAlign: "center",
            height: ScreenWidth / 9,  width: ScreenWidth / 9, borderRadius: 22, lineHeight: ScreenWidth / 11,
            borderWidth: 3, borderColor: dateIndex == componentIndex ? "white" : "black"}}>{weekday}
        </Text>
    }
    </Pressable>
  )
};

export default WeeklyIcon;

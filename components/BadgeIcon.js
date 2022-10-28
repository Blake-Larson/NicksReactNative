import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image, Modal, Pressable } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const BadgeIcon = ({title}) => {

  return (
    <View style={{backgroundColor: "lightgrey", height: 80, width: 90, margin: 10,justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'black', fontWeight: "bold", textAlign: "center", padding: 5}}>{title}</Text>
    </View>
  )
};

export default BadgeIcon;

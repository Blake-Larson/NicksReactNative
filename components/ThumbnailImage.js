import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const ThumbnailImage = ({ image }) => {

console.log('image...')
console.log(image)
  return (
    <View>
      <Image style={{height: 120, width: 80, marginLeft: 20, marginTop: 20}} source={{uri: image}} />
    </View>
  )
};

//        <Video style={{height: 500, width:400}} source={require('./media/birds.mp4')} />

export default ThumbnailImage;

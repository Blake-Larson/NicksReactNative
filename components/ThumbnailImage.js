import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, Button, TouchableHighlight, Dimensions, Image } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");

const ThumbnailImage = ({ image }) => {

  return (
    <View>
      <Image style={{height: 120, width: 80, marginLeft: 20, marginTop: 20}} source={{uri: image}} />
    </View>
  )
};

export default ThumbnailImage;

import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar, Pressable, StyleSheet } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Pdf from 'react-native-pdf';

const PdfViewer = ({navigation, route}) => {

  console.log('route', route)
  console.log(route.params[0])
  const url = route.params[0]['pdf_url'];
  const name = route.params[0]['pdf_name'];

  const source = {uri: url, cache: true};
  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <View style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <View style={{"backgroundColor": "black", paddingTop: 25}}>
          <TouchableOpacity style={{height: 35, marginLeft: 10, width: 30}} onPress={() => navigation.navigate('PdfList', [])}>
            <ImageBackground style={{color: "white", height: 20, width: 20}} source={require("../media/backarrow.png")}></ImageBackground>
          </TouchableOpacity>
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, marginBottom: 15, fontWeight: "bold"}}>{name}</Text>
          <View style={{backgroundColor: "red", height: 500, width: 400}}>
            <Pdf
              source={source}
              onLoadComplete={(numberOfPages,filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page,numberOfPages) => {
                  console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                  console.log(error);
              }}
              onPressLink={(uri) => {
                  console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdf}/>
          </View>

        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default PdfViewer;

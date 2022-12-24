import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView,
  TextInput, SafeAreaView, StatusBar, Pressable, StyleSheet } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
import Pdf from 'react-native-pdf';
import apiMiddleware from '../backend/apiMiddleware.js';

const PdfList = ({navigation, setValidLogin}) => {

  const [pdfList, setPdfList] = useState([]);
  const [loadingGif, setLoadingGif] = useState(true);

  const fetchPdfs = async () => {

    const apiParams = {};
    const api = `https://b8u7ie8np5.execute-api.us-west-1.amazonaws.com/dev/hw_getPdfResources`;

    const userResponse = await apiMiddleware(api, apiParams, setValidLogin)
    const output = await userResponse.json();
    setPdfList(output)
    setLoadingGif(false)
  }

  useEffect(() => {

    fetchPdfs();
  }, []);

  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}}>
        <View style={{"backgroundColor": "black", paddingTop: 25}}>
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, fontWeight: "bold"}}>Haute Wellness</Text>
          <Text style={{color: "white", fontSize: 35, marginLeft: 20, fontWeight: "bold"}}>PDF Resources</Text>
          {
            loadingGif == true ?
            <View style={{  flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: 125}}>
              <ImageBackground style={{color: "white", height: 40, width: 40}} source={require("../media/loading.gif")}></ImageBackground>
            </View>
            :
            pdfList.map((item, index) => (
              <View key={index} style={{flexDirection:"row", paddingLeft: 10, paddingTop: 10}}>
                <View style={{flex: 1,flexShrink: 1}}>
                  <Pressable style={{backgroundColor: "#323232", borderRadius: 10, height: 50, marginTop: 20, marginLeft: 10, marginRight: 10}} onPress={() => navigation.navigate('PdfViewer', [item])} >
                    <Text numberOfLines={2} style={{color: "white", paddingTop: 10, paddingBottom: 10, paddingLeft: 10, fontSize: 18, width: "80%", fontWeight: "bold"}}>{item.pdf_name}</Text>
                    <ImageBackground style={{color: "white", height: 40, width: 40, right: 0, marginTop: 5, marginRight: 20, position: "absolute"}} source={require("../media/chevronarrow.png")}></ImageBackground>
                  </Pressable>
                </View>
              </View>
            ))
          }
        </View>
      </ScrollView>
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

export default PdfList;

import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, RefreshControl,
  ImageBackground, StyleSheet, Pressable, Modal, Image } from 'react-native';
import AwsMedia from '../components/AwsMedia';
import WorkoutSelected from './WorkoutSelected';
import Paywall from '../components/Paywall';
import WeeklyIcon from '../components/WeeklyIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get("window");
const moment = require('moment');
const ITEM_SIZE = Dimensions.get('window').width * 0.9;
const SPACING = 6;
const RNFS = require("react-native-fs");

const Workouts = ({navigation, paywallShown, setPaywallShown, subInfo, setSubInfo, completedWorkouts, workouts}) => {

  const ref = useRef(null);
  const [dateIndex, setDateIndex] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cacheDate, setCacheDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initialIndex = new Date().getDay() - 1;
    if (initialIndex >= 0) setDateIndex(initialIndex);
    if (initialIndex < 0) setDateIndex(6);
/*
    const now = moment();
    const dateSelected = moment();
    const newDate = dateSelected.format('MM-DD-YYYY');
    */
    cleanUpCache();

    return () => {};
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
        //TODO: await getWorkouts();
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const cleanUpCache = () => {

    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then(result => {
        for (let i = 0; i < result.length; i++)
        {
          const cacheDate = result[i]['mtime'];
          const cacheDateFormat = new Date();
          const cacheDateStale = new Date(cacheDateFormat.setDate(cacheDateFormat.getDate() - 3));
          if (result[i]['mtime'] < cacheDateStale) console.log('yooooooooooooooo                          OLD')
          if (result[i]['mtime'] < cacheDateStale) RNFS.unlink(result[i]['path'])
        }
      });
  }

  const checkPaywall = async (item) => {

    if (paywallShown == true) setModalVisible(true)
    if (paywallShown == true) return;

    navigation.navigate('WorkoutSelected', [item]);
  }

  const getItemLayout = (data, index) => {(
    {length: ITEM_SIZE, offset: ITEM_SIZE * index, index}
  )}

  const scrollFlatListIndex = (index) => {
    ref.current.scrollToIndex({"index": index})
  }

  const onViewCallBack = React.useCallback((viewableItems)=> {
      setDateIndex(viewableItems.changed[0]['index'])
   }, []);

  const viewConfigRef = React.useRef({ waitForInteraction: true, minimumViewTime: 1000, itemVisiblePercentThreshold: 800 });

  return (
    <SafeAreaView style={{flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1',
      backgroundColor: "black"
      }}>
      {
        !workouts || !completedWorkouts &&
        <View style={{color: "red", height: 800, width: 800}}>
          <Text>TODO: TEST</Text>
        </View>
      }
      <StatusBar backgroundColor="black" barStyle={"light-content"} hidden={false} />
      <ScrollView style={{ marginTop: 0, flex: 1, width: ScreenWidth, paddingBottom: 10, backgroundColor: "black"}} refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh}/>}>
        <View style={{"backgroundColor": "black", paddingTop: 25}}>
          <View>
            <View style={{flexDirection: 'row', flex: 1, width: ScreenWidth, paddingBottom: 10}}>
              <Text style={{fontWeight: "bold", fontFamily: "System", fontSize: 35, paddingLeft: 25, color: "white", paddingBottom: 15}}>Haute Wellness</Text>
            </View>
            <View style={{flexDirection: 'row', flex: 1, width: ScreenWidth, paddingBottom: 10, alignItems: 'center', justifyContent: 'center'}}>
              <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={0} weekday={"M"} scrollFlatListIndex={scrollFlatListIndex}/>
              <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={1} weekday={"T"} scrollFlatListIndex={scrollFlatListIndex}/>
              <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={2} weekday={"W"} scrollFlatListIndex={scrollFlatListIndex}/>
              <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={3} weekday={"T"} scrollFlatListIndex={scrollFlatListIndex}/>
              <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={4} weekday={"F"} scrollFlatListIndex={scrollFlatListIndex}/>
              <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={5} weekday={"S"} scrollFlatListIndex={scrollFlatListIndex}/>
              <WeeklyIcon completedWorkouts={completedWorkouts} setDateIndex={setDateIndex} dateIndex={dateIndex} componentIndex={6} weekday={"S"} scrollFlatListIndex={scrollFlatListIndex}/>
            </View>
            <FlatList
              ref={ref}
              showsHorizontalScrollIndicator={false}
              data={workouts}
              horizontal
              viewabilityConfig={viewConfigRef.current}
              onViewableItemsChanged={(onViewCallBack)}
              initialScrollIndex={dateIndex}
              getItemLayout={(data, index) => { return {length: ITEM_SIZE, offset: ITEM_SIZE * index, index} }}
              renderItem={({ item, index: dateIndex }) => (
                <View style={{width: ITEM_SIZE}}>
                  <View style={{marginHorizontal: SPACING, padding: SPACING, borderRadius: 34}}>
                    <TouchableOpacity onPress={() => {checkPaywall(item)}}>
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
                            fontFamily: "System" }}>
                            {item.name}
                          </Text>
                          <Text style={{fontSize: 25,
                            position: "absolute",
                            top: 10,
                            left: 15,
                            opacity: 0.9,
                            color: "#fffdfe",
                            fontWeight: "bold",
                            fontFamily: "System" }}>{item.day}</Text>
                          {
                            paywallShown == true &&
                            <Image style={{position: "absolute",
                              top: 15,
                              right: 30,
                              height: 30,
                              width: 30 }} source={require("../media/padlock.png")} />
                          }
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <Modal
             animationType="slide"
             transparent={true}
             visible={modalVisible}
             onRequestClose={() => { setModalVisible(!modalVisible)}}>
               <View style={[styles.centeredView]}>
                 <View style={styles.modalView}>
                   <Pressable
                     style={[styles.button, styles.buttonClose]}
                     onPress={() => setModalVisible(!modalVisible)}>
                     <Text style={styles.textStyle}>X</Text>
                   </Pressable>
                   <Paywall subInfo={subInfo} setSubInfo={setSubInfo} paywallShown={paywallShown} setPaywallShown={setPaywallShown} />
                 </View>
               </View>
             </Modal>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    height: '100%',
    marginTop: '40%',
    backgroundColor: "#4D504F",
    borderRadius: 20,
    paddingTop: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: "absolute",
    top: 10,
    right: 15,
    opacity: 0.9,
    color: "#fffdfe",
    fontWeight: "bold",
    fontFamily: "System"
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "white",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    padding: 30
  }
});

export default Workouts;

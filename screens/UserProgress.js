import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ScrollView, SectionList, RefreshControl, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
const moment = require('moment');

const UserProgress = ({navigation}) => {

  const [progress, setProgress] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteCardContent, setDeleteCardContent] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);

  const [currentView, setCurrentView] = useState('Weekly');
  const [allProgress, setAllProgress] = useState([]);
  const [monthlyDate, setMonthlyDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});

  const onRefresh = async () => {
    try {

      setRefreshing(true);
      await getUserProgress();
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserProgress = async () => {

    const storageToken = await AsyncStorage.getItem("REFRESH_TOKEN");
    const userMetaDataString = await AsyncStorage.getItem("USER_METADATA");
    const userMetaData = JSON.parse(userMetaDataString);
    const userid = userMetaData[0]['userid'];

    const api = `https://hautewellnessapp.com/api/getUserProgress`;
    const apiParams = {};
    apiParams['userid'] = userid;
    apiParams['id_token'] = storageToken;

    const response = await fetch(api, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'same-origin',
     body: JSON.stringify(apiParams)
    });

    const jsonProgress = await response.json();

    const selectedDatesObj = {}
    for (let i = 0; i < jsonProgress.length; i++)
    {
      const row = jsonProgress[i];
      const scheduleDateString = jsonProgress[i]['schedule_date'].replace(/T.*/, '')
      console.log(scheduleDateString)
      const date_components = scheduleDateString.split("-");
      const year = date_components[0];
      const month = date_components[1];
      const day = date_components[2];
      jsonProgress[i]['readableDate'] = `${month}-${day}-${year}`;
      selectedDatesObj[scheduleDateString] = {dotColor: 'red', marked: true}
    }

    setProgress(jsonProgress);
    setMarkedDates(selectedDatesObj);
  };

  useEffect(() => {
    getUserProgress()
  }, []);

  const renderItem = ({ item }) => (
      <Item series={item.series} status={item.status} />
    );

  const openDeleteModal = (item) => {
    setDeleteCardContent(item)
      setModalVisible(true);
  };

  const daySelected = (day) =>
  {
    setSelectedDate([]);

    for (let i = 0; i < progress.length; i++)
    {
      const schedule_date = progress[i]['schedule_date'].replace(/T.*/, '')

      if (schedule_date == day.dateString) setSelectedDate([progress[i]])
    }
  }

  const dayPressedChange = (day) => {

    const originalMarkedDates = markedDates;
    for (const element in originalMarkedDates)
    {
      originalMarkedDates[element]['selected'] = false;
    }
    let output = originalMarkedDates[day.dateString];
    if (!output) output = {}
    output['selected'] = true;

    setMarkedDates({...originalMarkedDates, [day.dateString]: output})
    daySelected(day);
  }

  const Item = ({ series, status }) => (
    <View>
      <Text style={{marginTop: 15, fontSize: 15, backgroundColor: "grey"}}>{series}</Text>
      <Text style={{fontSize: 15, backgroundColor: "grey"}}>{status}</Text>
    </View>
  );

  return (
    <ScrollView style={{backgroundColor: "black"}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      <View style={{alignItems: 'center',flexDirection: 'row', paddingTop: 80, fontSize: 15}}>
        <Button title="Week" onPress={()=> setCurrentView("Weekly")}/>
        <Button title="Badges" onPress={() => setCurrentView("Badges")}/>
      </View>
      {
        currentView == 'Weekly' &&
        <View>
          <Calendar
            style={{
              borderWidth: 1,
              backgroundColor: "black",
              calendarBackground: "#00adf5",
              height: 350,
              fontSize: 20
            }}
            theme={{
              arrowColor: 'white',
              calendarBackground: "black",
              backgroundColor: "black",
              textSectionTitleColor: 'white',
              todayTextColor: 'red',
              dayTextColor: 'white',
              textDisabledColor: 'white',
              selectedDayBackgroundColor: 'white',
              selectedDayTextColor: 'red',
              textDayFontSize: 16,
              textMonthFontSize: 20,
            }}
            markedDates={markedDates}
            initialDate={moment(new Date()).format('YYYY-MM-DD')}
            onDayPress={day => {
              dayPressedChange(day);
            }}
            selected={'2022-10-10'}
            monthFormat={'yyyy MM'}
            onMonthChange={month => {
              setMonthlyDate(month.dateString)
            }}
            hideExtraDays={true}
            firstDay={1}
            onPressArrowLeft={subtractMonth => subtractMonth(subtractMonth)}
            onPressArrowRight={addMonth => addMonth(addMonth)}
            renderHeader={() => {  return <Text style={{color: "white", fontWeight: "bold", fontSize: 24}}>{moment(monthlyDate).format('MMMM YYYY')}</Text> }}
          />
          {selectedDate.map((item) => (
            <View key={item.logid} style={{marginTop: 15, marginLeft: 15, marginRight: 15, fontSize: 15, backgroundColor: "lightgrey"}}>
              <TouchableOpacity onPress={() => openDeleteModal(item)} style={{right: 0, position: 'absolute', backgroundColor: "grey", marginLeft: 10}}>
                <Text style={{paddingLeft:30, paddingBottom: 30, fontSize: 30}}>X</Text>
              </TouchableOpacity>
              <Text style={{marginLeft: 15, marginRight: 15, marginTop: 15, fontWeight: "bold", fontSize: 20}}>{item.readableDate}</Text>
              <Text style={{marginLeft: 15, marginRight: 15, marginTop: 15, fontSize: 18}}>Workout Name: <Text style={{fontWeight: "bold"}}>{item.workout_name}</Text></Text>
              <Text style={{marginLeft: 15, marginRight: 15, fontSize: 15, marginBottom: 15, fontSize: 18}}>Total Workout Time: {item.status}</Text>
              <View style={styles.centeredView}>
                <Modal
                  style={styles.centeredView}
                   transparent={true}
                   visible={modalVisible}
                   onRequestClose={() => {
                     Alert.alert("Modal has been closed.");
                     setModalVisible(!modalVisible);
                   }}>
                     <View style={styles.modalView}>
                       <Text style={styles.modalText}>Are you sure you want to delete? {JSON.stringify(deleteCardContent)}</Text>
                       <View style={{ flexDirection: 'row' }}>
                         <Pressable
                           style={[styles.button, styles.buttonClose]}
                           onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Close</Text>
                         </Pressable>
                         <Pressable
                           style={[styles.button, styles.buttonDelete]}
                           onPress={() => deleteUserProgress()}>
                            <Text style={styles.textStyle}>Delete</Text>
                         </Pressable>
                      </View>
                   </View>
                </Modal>
              </View>
            </View>
          ))}
        </View>
      }
      {
        currentView == 'Badges' &&
        <View>
          <Text style={{paddingTop: 10, paddingLeft: 10, color: "white"}}>Badges selected</Text>
          <Text style={{paddingTop: 10, paddingLeft: 10, color: "white"}}>{JSON.stringify(allProgress)}</Text>
        </View>
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 60,
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonDelete: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default UserProgress;

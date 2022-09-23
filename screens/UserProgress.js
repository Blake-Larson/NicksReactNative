import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, ScrollView, SectionList, RefreshControl, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
const moment = require('moment');

const UserProgress = ({navigation}) => {

  const [progress, setProgress] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dateSelected, setDateSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState([]);
  const [deleteCardContent, setDeleteCardContent] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [startingDate, setStartingDate] = useState([]);
  const [writtenDate, setWrittenDate] = useState([]);
  const [currentView, setCurrentView] = useState([]);
  const [allProgress, setAllProgress] = useState([]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const result = await getUserProgress();
      setRefreshing(false);
      return result;
    } catch (error) {
      console.error(error);
    }
    };

  const getUserProgress = () => {
  return '';/*//fetch(`http://${url}:3000/user_progress?userid=${uid}`)
    .then((response) => response.json())
    .then((json) => {
      markedDatesFn(json)
      setAllProgress(json);
      return json;
    })
    .catch((error) => {
      console.error(error);
    });*/
  };
  useEffect(() => {

    setCurrentView("Weekly");
    const now = moment();
    const dateSelected = moment();
    const newDate = dateSelected.format('MM-DD-YYYY');

    setWrittenDate(now.format('ll'))
    setStartingDate(dateSelected);
//    onDateSelected(dateSelected);
    //getUserProgress();
  }, []);

  const renderItem = ({ item }) => (
      <Item series={item.series} status={item.status} />
    );

  const openDeleteModal = (item) => {
    setDeleteCardContent(item)
      setModalVisible(true);
  };

  const onDateSelected = async (param) => {

    const dateSelected = moment(param);
    const newDate = dateSelected.format('MM-DD-YYYY');

    setWrittenDate(dateSelected.format('ll'))
    setSelectedDate(newDate);
    try {
      const response = ''//await fetch(`http://${url}:3000/user_progress_date?userid=${uid}&created=${newDate}`);
      const json = await response.json();
      setProgress(json);
      return json;
    } catch (error) {
      console.error(error);
    }
  }
  const refreshDateSelected = async () => {

    try {
      const response = ''//await fetch(`http://${url}:3000/user_progress_date?userid=${uid}&created=${selectedDate}`);
      const json = await response.json();
      setProgress(json);
      return json;
    } catch (error) {
      console.error(error);
    }
  }

  const deleteUserProgress = async () => {

    setModalVisible(!modalVisible);
    try {
      const response = ''// await fetch(`http://${url}:3000/user_progress_delete?userid=${uid}&logid=${deleteCardContent.logid}`);
      const json = await response.json();
      getUserProgress();
      refreshDateSelected();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const markedDatesFn = (json) => {
    const markedDateArray = [];
    for (let i = 0; i < json.length; i++)
    {
      markedDateArray.push({
          date: moment(json[i]['created']),
          dots: [{color: "red"}]
      });
    }
    setMarkedDates(markedDateArray);
  }

  const viewSelected = (param) => {
    console.log(param);
  }

  const Item = ({ series, status }) => (
    <View>
      <Text style={{marginTop: 15, fontSize: 15, backgroundColor: "grey"}}>{series}</Text>
      <Text style={{fontSize: 15, backgroundColor: "grey"}}>{status}</Text>
    </View>
  );

  return (
    <ScrollView style={{backgroundColor: "grey"}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      <View style={{alignItems: 'center',flexDirection: 'row', paddingTop: 20, fontSize: 15}}>
        <Button title="Week" onPress={()=> setCurrentView("Weekly")}/>
        <Button title="Badges" onPress={() => setCurrentView("Badges")}/>
      </View>
      {
        currentView == 'Weekly' &&
        <View>
          <CalendarStrip
            scrollable
            selectedDate={startingDate}
            style={{height:100, paddingTop: 10, paddingBottom: 10}}
            calendarHeaderStyle={{color: 'black'}}
            dateNumberStyle={{color: 'black'}}
            dateNameStyle={{color: 'black'}}
            iconContainer={{flex: 0.1}}
            daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'red'}}
            onDateSelected={onDateSelected}
            markedDates={markedDates}
          />
          <Text style={{fontSize: 30}}>{writtenDate}</Text>
          <Text style={{fontSize: 10}}>User Progress! {JSON.stringify(progress)}</Text>
          {progress.map((item) => (
            <View key={item.logid} style={{marginTop: 15, marginLeft: 15, marginRight: 15, fontSize: 15, backgroundColor: "lightgrey"}}>
              <TouchableOpacity onPress={() => openDeleteModal(item)} style={{alignSelf: 'flex-end', position: 'absolute', backgroundColor: "grey"}}>
                <Text style={{paddingLeft:30, paddingBottom: 30, fontSize: 30}}>X</Text>
              </TouchableOpacity>
              <Text style={{marginLeft: 15, marginRight: 15, marginTop: 15}}>{item.logid}</Text>
              <Text style={{marginLeft: 15, marginRight: 15, marginTop: 15}}>{item.series}</Text>
              <Text style={{marginLeft: 15, marginRight: 15, fontSize: 15, marginBottom: 15}}>{item.status}</Text>
              <Text style={{marginLeft: 15, marginRight: 15, fontSize: 15, marginBottom: 15}}>{item.created}</Text>
              <View style={styles.centeredView}>
                <Modal
                  style={styles.centeredView}
                   transparent={true}
                   visible={modalVisible}
                   onRequestClose={() => {
                     Alert.alert("Modal has been closed.");
                     setModalVisible(!modalVisible);
                   }}
                 >
                     <View style={styles.modalView}>
                       <Text style={styles.modalText}>Are you sure you want to delete? {JSON.stringify(deleteCardContent)}</Text>

                       <View style={{ flexDirection: 'row' }}>
                         <Pressable
                           style={[styles.button, styles.buttonClose]}
                           onPress={() => setModalVisible(!modalVisible)}
                         >
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
          <Text style={{paddingTop: 10, paddingLeft: 10}}>Badges selected</Text>
          <Text style={{paddingTop: 10, paddingLeft: 10}}>{JSON.stringify(allProgress)}</Text>
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

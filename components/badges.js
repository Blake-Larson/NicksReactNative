// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGCegA0js5f2aRVBtX47wInKbl3ePrHaM",
  authDomain: "fitapp-6fd8b.firebaseapp.com",
  projectId: "fitapp-6fd8b",
  storageBucket: "fitapp-6fd8b.appspot.com",
  messagingSenderId: "805458778919",
  appId: "1:805458778919:web:65976a30ab372f49252702",
  measurementId: "G-FH1R9BTSS6"
};
const app = initializeApp(firebaseConfig);

import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore/lite';
import { query, where } from "firebase/firestore/lite";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
console.log('badges...')
const db = getFirestore(app);

// Get a list of cities from your database

async function getBadges2(db) {

  const badgesCol = collection(db, 'badges');
  const q = query(collection(db, "badges"), where("type", "==", "cold_showers"));

  const badgeSnapshot = await getDocs(badgesCol);
  //const badgeSnapshot = await getDocs(q);
  const badgeList = badgeSnapshot.docs.map(doc => doc.data());
  console.log('badge list.... \n\n')
  console.log(badgeList);
  return badgeList;
}

export async function test2() {
  console.log('db')
  console.log(db)
  const output = await getBadges2(db);
  console.log(output)
  return output;
}

export async function test3(count) {
  const output = await setData(db, count);
  return output;
}

export async function setData(db, count) {

  console.log(' set new count')
  console.log(count)
  const badgesRef = collection(db, "badges");
  //const badgesRef = db.collection('badges');

  await setDoc(doc(badgesRef, "stepBadge"), {
      count: count });
  /*const res = await db.collection('badges').doc('stepBadges') /*.update({
    count: count
  });*/
  /*
  const usersRef = ref.child('users');
  const hopperRef = usersRef.child('gracehop');
  hopperRef.update({
    'nickname': 'Amazing Grace'
  });
  */
}

const Badges = () => {
  const [badges, setBadges] = useState([]);

  //const test = getBadges2();
  //console.log(test);
  console.log('start')


  useEffect(() => {
      const getUsers = async () => {
        const badgesCol = collection(db, 'badges');
        const badgeSnapshot = await getDocs(badgesCol);
        const badgeList = badgeSnapshot.docs.map(doc => doc.data());
        console.log(badgeList[0])
        setBadges(JSON.stringify(badgeList));
        console.log('done with getData')

      }
      getUsers();
  }, []);
  return (
    <Text>Brand new page</Text>
  );
};

export default Badges;

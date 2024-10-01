import { View, Text, Task } from "react-native";
import React, { useEffect } from "react";
import AppGradient from "@/components/AppGradient";
import { useState } from "react";
import { Databases, Query } from "react-native-appwrite";
import {client, config} from "../../lib/appwrite";


const databases = new Databases(client)

interface Routine {
  $title: string;
}

const Home = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(()=>{
    const getRoutines = async() => {
      try{

        const result = await databases.listDocuments(config.databaseId, config.routinesCollectionId, [Query.select(["title"])] );
        console.log(result.documents)
        if(result){
          setRoutines(result.documents)
        }
        
      }catch(error){
        console.error("result is not there")
        throw new Error;
      }

    }
    getRoutines();
  },[])



  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
    <View>
      <Text>Home</Text>
    </View>
    </AppGradient>
  );
};

export default Home;

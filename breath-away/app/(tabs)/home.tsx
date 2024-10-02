import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import AppGradient from "@/components/AppGradient";
import { useState } from "react";
import { Databases, Query } from "react-native-appwrite";
import {client, config} from "../../lib/appwrite";
import { ScrollView } from "react-native";
import { router } from "expo-router";
const databases = new Databases(client)

interface Routine {
  $title: string;
  $img: string;
  $instructions: string;
  $description: string;
}

const Home = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(()=>{
    const getRoutines = async() => {
      try{

        const result = await databases.listDocuments(config.databaseId, config.routinesCollectionId, [Query.select(["title", "img", "instructions", "description"])] );
        if(result){
          setRoutines(result.documents.map(doc => ({
            $title: doc.title,
            $img: doc.img,
            $instructions: doc.instructions,
            $description: doc.description
          })) as Routine[])   
        }
        
      }catch(error){
      
        throw new Error;
      }

    }
    getRoutines();
  },[])



  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-2xl font-bold">Routines</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        pagingEnabled={false} 
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          // alignItems: 'center',
          marginHorizontal: 16, 
          marginVertical: 120
          ,
          paddingVertical: 50, 
          paddingHorizontal: 50,
          
        }}
        className="w-full h-full"
      >
        {routines.map((routine, index) => (
          <View key={`routine-${index}`} className="w-64 m-4 items-center">
            <View className="w-64 h-64 justify-center items-center relative">
              <View className="w-full h-full rounded-full absolute" style={{ 
                shadowRadius: 5, 
                shadowOpacity: 0.3,
                shadowColor: '#000', 
                elevation: 10, // android!!
                backgroundColor: 'white',
              
              }}>
                <TouchableOpacity onPress={() => { router.push(`/routines` as any) }} className="w-full h-full rounded-full absolute">
                  <Image 
                    source={{uri: routine.$img}} 
                    className="w-full h-full rounded-full absolute"
                  />
                </TouchableOpacity>
              </View>
              <View className="absolute w-full h-full justify-center items-center">
                <Text className="text-white text-lg font-bold z-10">
                  {routine.$title}
                </Text>
              </View>
            </View>
            <View className="w-full mt-4">
              <Text className="text-white mt-4 text-center">{routine.$description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
    </AppGradient>
  );
};

export default Home;

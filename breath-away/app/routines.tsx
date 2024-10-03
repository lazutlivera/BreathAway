import React, { useEffect } from 'react'
import { View, Text, } from 'react-native'
import AppGradient from '../components/AppGradient'
import {router} from "expo-router"
import { useRoute } from '@react-navigation/native'
import { getRoutinesById } from '@/lib/appwrite'








const Routines = () => {
  const route = useRoute() 
  const { title, id } = route.params as {title: string, id: string};

  useEffect(()=>{

    getRoutinesById(id).then(result =>{
      console.log(result.documents)

    })

  }, [])

  console.log(id)
  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-2xl font-bold">{id}</Text>
    </View>
    </AppGradient>
  )
}

export default Routines
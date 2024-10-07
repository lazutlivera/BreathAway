import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import React, { useEffect } from "react";
import AppGradient from "@/components/AppGradient";
import { useState } from "react";
import { ScrollView } from "react-native";
import { router, Link } from "expo-router";
import { getRoutines } from "../../lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import GestureRecognizer from 'react-native-swipe-gestures';
import { Ionicons } from '@expo/vector-icons'; // Make sure to import this

const Home = () => {
  const [routines, setRoutines] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState<string>("");

  const { showInstructions } = useGlobalContext();

  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

  useEffect(() => {
    getRoutines().then((result: any) => {
      setRoutines(result.documents);
    });

  }, []);

  const handlePress = (routine: any) => {
    setSelectedRoutine(routine);
    setSelectedInstructions(routine.instructions);
    setModalVisible(true);
  };

  const onSwipeDown = () => {
    setModalVisible(false);
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      onSwipeDown={() => setModalVisible(false)}
    >
      <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-2xl font-bold">Routines</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            pagingEnabled={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              marginHorizontal: 16,
              marginVertical: 120,
              paddingVertical: 50,
              paddingHorizontal: 50,
            }}
            className="w-full h-full"
          >
            {routines.map((routine, index) => (
              <View key={`routine-${index}`} className="w-64 m-4 items-center">
                <View className="w-64 h-64 justify-center items-center relative">
                  <View
                    className="w-full h-full rounded-full absolute"
                    style={{
                      shadowRadius: 5,
                      shadowOpacity: 0.3,
                      shadowColor: "#000",
                      elevation: 10, // android!!
                      backgroundColor: "white",
                    }}
                  >
                    <Image
                      source={{ uri: routine.img }}
                      className="w-full h-full rounded-full absolute"
                    />

                    <TouchableOpacity
                      onPress={() => {
                        if (showInstructions) {
                          handlePress(routine);
                        } else {
                          router.push({
                            pathname: `/routines`,
                            params: { id: routine.$id, title: routine.title },
                          });
                        }
                      }}
                      className="w-full h-full rounded-full absolute"
                    >
                      <View className="absolute w-full h-full justify-center items-center">
                        <Text className="text-white text-lg font-bold z-10">
                          {routine.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="w-full mt-4">
                  <Text className="text-white mt-4 text-center">
                    {routine.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View className="flex-1 justify-end">
            <View className="max-h-3/4 bg-[#161b2e] rounded-t-3xl p-5 items-center relative">
              <TouchableOpacity
                className="absolute top-2 right-2 z-10"
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="white" marginTop={5} marginRight={5} />
              </TouchableOpacity>
              <View className="w-10 h-1 bg-white/30 rounded-full mb-5" />
              <ScrollView className="w-full">
                <Text className="text-white text-2xl font-bold mb-5 text-center">
                  {selectedRoutine?.title}
                </Text>
                <Text className="text-white text-base mb-5 text-center">
                  {selectedInstructions}
                </Text>
              </ScrollView>
              <View className="flex-row justify-center w-full mt-5">
                <TouchableOpacity
                  className="bg-[#0a4d4a] p-4 rounded-lg flex-1"
                  onPress={() => {
                    if (selectedRoutine) {
                      router.push({
                        pathname: `/routines`,
                        params: { id: selectedRoutine.$id, title: selectedRoutine.title },
                      });
                      setModalVisible(false);
                    }
                  }}
                >
                  <Text className="text-white text-center font-bold">Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </AppGradient>
    </GestureRecognizer>
  );
};

export default Home;

//

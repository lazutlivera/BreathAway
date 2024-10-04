import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import React, { useEffect } from "react";
import AppGradient from "@/components/AppGradient";
import { useState } from "react";
import { ScrollView } from "react-native";
import { router, Link } from "expo-router";
import { getRoutines } from "../../lib/appwrite";

const Home = () => {
  const [routines, setRoutines] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState<string>("");

  useEffect(() => {
    getRoutines().then((result: any) => {
      setRoutines(result.documents);
    });
  }, []);

  const handleLongPress = (instructions: string) => {
    setSelectedInstructions(instructions);
    setModalVisible(true);
  };

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
            justifyContent: "center",
            // alignItems: 'center',
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
                    onLongPress={() => handleLongPress(routine.instructions)}
                    onPress={() => {
                      router.push({
                        pathname: `/routines`,
                        params: { id: routine.$id, title: routine.title },
                      });
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

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-center items-center mt-6 opacity-90">
          <View className="m-5 bg-blue-900 rounded-lg p-9 items-center shadow-lg shadow-black">
            <Text className="text-white mb-4 text-center">
              {selectedInstructions}
            </Text>
            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                className="rounded-lg p-2 bg-blue-500 flex-1 mr-2"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-bold text-center">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-lg p-2 bg-blue-500 flex-1 ml-2"
                onPress={() => {
                  router.push(`/routines` as any);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text className="text-white font-bold text-center">Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AppGradient>
  );
};

export default Home;

//

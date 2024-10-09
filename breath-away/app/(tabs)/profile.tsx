import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Modal,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import AppwriteService from "@/lib/appwrite";
import Logout from "../../assets/icons/logout.png";
import AppGradient from "@/components/AppGradient";
import profilePictureUrl from "../../assets/images/logo.png";
import CustomButton from "@/components/CustomButton";

const gradients = [
  ["#2E2E2E", "#424242", "#575757", "#6b6b6b"],
  ["#1e3c72", "#2a5298"],
  ["#ff7e5f", "#feb47b"],
  ["#6a11cb", "#2575fc"],
  ["#00c6ff", "#0072ff"],
];

const Profile = () => {
  const { setUser, setIsLoggedIn, showInstructions, toggleShowInstructions } =
    useGlobalContext();
  const [username, setUsername] = useState<string | null>(null);
  const [completedRoutines, setCompletedRoutines] = useState<any[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bgModalVisible, setBgModalVisible] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(0);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const loadGradient = async () => {
      try {
        const savedGradient = await AsyncStorage.getItem("selectedGradient");
        if (savedGradient !== null) {
          setSelectedGradient(Number(savedGradient));
        }
      } catch (err) {
        console.log("Failed to load gradient:", err);
      }
    };

    loadGradient();

    AppwriteService.getUserCompletedRoutines()
      .then((result) => {
        setUsername(result.user.username);
        setCompletedRoutines(result.completedRoutines);
        setBadges(result.user.badges || []);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  const handleGradientSelect = async (index: number) => {
    try {
      await AsyncStorage.setItem("selectedGradient", index.toString());
      setSelectedGradient(index);
      handleCloseBgModal();
    } catch (err) {
      console.log("Failed to save gradient:", err);
    }
  };

  const logout = async () => {
    await AppwriteService.signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  const confirmLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "No",
          onPress: () => {
            style: "cancel";
          },
        },
        {
          text: "Yes",
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  const handleRoutinePress = (routineName: string) => {
    console.log(`Pressed ${routineName}`);
  };

  const handleRedirectToHome = () => {
    router.push("/home");
  };

  const handleShowBadges = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenBgModal = () => {
    setBgModalVisible(true);
  };

  const handleCloseBgModal = () => {
    setBgModalVisible(false);
  };

  return (
    <AppGradient colors={gradients[selectedGradient]}>
      <View className="flex-1 justify-between">
        <View className="px-4 mt-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleOpenBgModal}
              className="bg-white rounded-lg px-4 py-2 flex flex-row items-center justify-center"
            >
              <Entypo name="brush" size={20} color="black" className="mr-2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmLogout}
              className="bg-red-600 rounded-lg px-4 py-2 flex flex-row items-center justify-center"
            >
              <Image source={Logout} resizeMode="contain" className="w-4 h-4" />
              <Text className="text-white ml-2 text-sm font-light">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="items-center mt-5">
          <Animated.Image
            source={profilePictureUrl}
            className="w-32 h-32 rounded-full"
            resizeMode="cover"
          />
          <Text className="text-white text-3xl font-semibold mb-5">
            {username}
          </Text>
          <View className="flex-row justify-around w-full mt-4">
            <View className="items-center">
              <Text className="text-white text-xl font-semibold">
                {completedRoutines.length}
              </Text>
              <Text className="text-gray-200 font-light">
                Routines Completed
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleShowBadges}
              className="items-center cursor-pointer"
            >
              <Text className="text-white text-xl font-semibold">
                {badges.length} Badges
              </Text>
              <Text className="text-gray-200 font-light">
                Tap to View Badges
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 flex-1">
          <Text className="text-white text-lg font-light text-center my-3">
            Recently Completed Routines
          </Text>
          <View className="flex-1">
            {completedRoutines.length === 0 ? (
              <>
                <Text className="text-white text-lg text-center mb-4">
                  You are yet to try a routine!
                </Text>
              </>
            ) : (
              <Animated.FlatList
                data={completedRoutines}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRoutinePress(item.routineName)}
                    style={{
                      backgroundColor: "#fff",
                      margin: 10,
                      padding: 20,
                      borderRadius: 15,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  >
                    <Text className="text-black text-lg font-semibold">
                      {item.routineName}
                    </Text>
                    <Text className="text-gray-500">
                      Completed on{" "}
                      {new Date(item.completionDate).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{
                  paddingBottom: 10,
                  paddingHorizontal: 4,
                }}
                style={{ width: "100%" }}
              />
            )}
          </View>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-xl font-semibold mb-4">Collected Badges</Text>
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <Text key={index} className="text-gray-700 text-lg mb-2">
                  {badge}
                </Text>
              ))
            ) : (
              <Text className="text-gray-700 text-lg">
                No badges collected yet.
              </Text>
            )}
            <TouchableOpacity
              onPress={handleCloseModal}
              className="mt-4 bg-red-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={bgModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseBgModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-xl font-semibold mb-4">
              Choose Background
            </Text>
            {gradients.map((gradient, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleGradientSelect(index)}
                className="mb-2 p-4 rounded-lg"
                style={{ backgroundColor: gradient[0] }}
              ></TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={handleCloseBgModal}
              className="mt-4 bg-red-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AppGradient>
  );
};

export default Profile;

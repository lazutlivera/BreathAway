import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Animated,
  Modal,
} from "react-native";

import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { getUserCompletedRoutines, signOut } from "@/lib/appwrite";
import Logout from "../../assets/icons/logout.png";
import AppGradient from "@/components/AppGradient";
import profilePictureUrl from "../../assets/images/logo.png";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { setUser, setIsLoggedIn, showInstructions, toggleShowInstructions } =
    useGlobalContext();
  const [username, setUsername] = useState<string | null>(null);
  const [completedRoutines, setCompletedRoutines] = useState<any[]>([]);
  const [badges, setBadges] = useState<string[]>([]); // Array to hold collected badges
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const scrollY = new Animated.Value(0);

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch user data and badges (assuming you have badges logic)
    getUserCompletedRoutines()
      .then((result) => {
        setUsername(result.user.username);
        setCompletedRoutines(result.completedRoutines);
        setBadges(result.user.badges || []); // Assuming badges are part of the user object
      })
      .catch((err) => console.log("Failed to fetch data:", err));
  }, []);

  const logout = async () => {
    await signOut();
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
          onPress: () => console.log("Logout Cancelled"),
          style: "cancel",
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

  const handleToggleShowInstructions = (value: boolean) => {
    toggleShowInstructions(value);
  };

  const handleRedirectToHome = () => {
    router.push("/home");
  };

  // Function to open the modal when the badges text is pressed
  const handleShowBadges = () => {
    setModalVisible(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <AppGradient colors={["#1e3c72", "#2a5298", "#2c6bff"]}>
      <View className="flex-1 justify-between">
        {/* Header section with logout and switch */}
        <View className="flex-row justify-between items-center px-4 mt-4">
          <View className="flex-row items-center">
            <Switch
              value={showInstructions}
              onValueChange={handleToggleShowInstructions}
              className="mr-2"
            />
            <Text className="text-white text-lg">Show Instructions</Text>
          </View>

          <TouchableOpacity
            onPress={confirmLogout}
            className="bg-red-600 rounded-lg px-3 py-2 flex flex-row items-center"
          >
            <Image source={Logout} resizeMode="contain" className="w-4 h-3" />
            <Text className="text-white ml-2 text-sm">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center mt-5">
          <Animated.Image
            source={profilePictureUrl}
            className="w-32 h-32 rounded-full mb-1"
            resizeMode="cover"
            style={{
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [0, 150],
                    outputRange: [1, 0.8],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          />
          <Text className="text-white text-2xl font-bold">{username}</Text>
          <View className="flex-row justify-around w-full mt-4">
            <View className="items-center">
              <Text className="text-white text-xl font-semibold">
                {completedRoutines.length}
              </Text>
              <Text className="text-gray-400">Routines Completed</Text>
            </View>
            {/* Touchable Badges Text */}
            <TouchableOpacity
              onPress={handleShowBadges}
              className="items-center cursor-pointer"
            >
              <Text className="text-white text-xl font-semibold">
                {badges.length} Badges
              </Text>
              <Text className="text-gray-400">Tap to View Badges</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recently Completed Routines section */}
        <View className="mt-6 flex-1">
          <Text className="text-white text-lg font-semibold mb-2 text-center">
            Recently Completed Routines
          </Text>
          <View className="flex-1">
            {completedRoutines.length === 0 ? (
              <>
                <Text className="text-white text-lg text-center mb-4">
                  Select your first routine.
                </Text>
                <TouchableOpacity
                  onPress={handleRedirectToHome}
                  className="bg-green-500 px-5 py-2 rounded-lg shadow-lg mt-2"
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Go to Homepage
                  </Text>
                </TouchableOpacity>
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
                  paddingHorizontal: 4, // Ensure content is full-width
                }}
                style={{ width: "100%" }} // Ensure list takes full width
              />
            )}
          </View>
        </View>
      </View>

      {/* Modal for showing badges */}
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
    </AppGradient>
  );
};

export default Profile;

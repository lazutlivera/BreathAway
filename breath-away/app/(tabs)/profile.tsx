import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Animated,
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
  const scrollY = new Animated.Value(0);

  const navigation = useNavigation();

  useEffect(() => {
    getUserCompletedRoutines()
      .then((result) => {
        setUsername(result.user.username);
        setCompletedRoutines(result.completedRoutines);
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

  return (
    <AppGradient colors={["#161B2E", "#0A4D4A", "#766E67"]}>
      <View className="flex-1 justify-between">
        <View className="flex flex-row items-end px-4 mt-4">
          <TouchableOpacity
            onPress={confirmLogout}
            className="bg-red-600 rounded-lg px-3 py-2 flex flex-row items-center ml-auto"
          >
            <Image source={Logout} resizeMode="contain" className="w-5 h-5" />
            <Text className="text-white ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center px-4 mt-4">
          <Text className="text-white text-lg">Show Instructions</Text>
          <Switch
            value={showInstructions}
            onValueChange={handleToggleShowInstructions}
          />
        </View>
        <View className="items-center mt-5">
          <Image
            source={profilePictureUrl}
            className="w-24 h-24 rounded-full mb-1"
            resizeMode="cover"
          />
          <Text className="text-white text-2xl">{username}</Text>
          <View className="flex-row justify-around w-full mt-4">
            <View className="items-center">
              <Text className="text-white text-xl">
                {completedRoutines.length}
              </Text>
              <Text className="text-gray-400">Routines Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl">5</Text>
              <Text className="text-gray-400">Badges Collected</Text>
            </View>
          </View>
        </View>
        <View className="mt-6 w-full flex-1 align-items-center">
          <Text className="text-white text-lg font-semibold mb-2 text-center">
            Recently Completed Routines
          </Text>
          <View style={{ flex: 1 }}>
            {completedRoutines.length === 0 ? (
              <>
                <Text>Select your first routine.</Text>
                <TouchableOpacity
                  onPress={handleRedirectToHome}
                  style={{
                    marginTop: 20,
                    backgroundColor: "#4CAF50",
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>
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
                      backgroundColor: "#ccc",
                      margin: 10,
                      padding: 20,
                      borderRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                    }}
                  >
                    <Text>{item.routineName}</Text>
                    <Text>{`Completed on ${new Date(
                      item.completionDate
                    ).toLocaleDateString()}`}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            )}
          </View>
        </View>
      </View>
    </AppGradient>
  );
};

export default Profile;

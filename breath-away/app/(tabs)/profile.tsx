import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { getCurrentUser, signOut } from "@/lib/appwrite";
import Logout from "../../assets/icons/logout.png";
import AppGradient from "@/components/AppGradient";
import profilePictureUrl from "../../assets/images/logo.png";

const Profile = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        setUsername(res.username);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  const handleRoutinePress = (routineName: string) => {
    // Add your navigation or any action for the routine here
    console.log(`Pressed ${routineName}`);
  };

  return (
    <AppGradient colors={["#161B2E", "#0A4D4A", "#766E67"]}>
      <View className="flex-1 justify-between">
        {/* Header Section */}
        <View className="flex-row justify-between items-center px-4 mt-4">
          <Text className="text-white text-lg font-semibold">Profile</Text>
          <TouchableOpacity onPress={logout} className="bg-red-600 rounded-lg px-3 py-2 flex flex-row items-center">
            <Image source={Logout} resizeMode="contain" className="w-5 h-5" />
            <Text className="text-white ml-2">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View className="items-center mt-5">
          <Image
            source={profilePictureUrl}
            className="w-24 h-24 rounded-full mb-1"
            resizeMode="cover"
          />
          <Text className="text-white text-2xl">{username}</Text>

          {/* Stats Section Centered */}
          <View className="flex-row justify-around w-full mt-4">
            <View className="items-center">
              <Text className="text-white text-xl">10</Text>
              <Text className="text-gray-400">Routines Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl">5</Text>
              <Text className="text-gray-400">Badges Collected</Text>
            </View>
          </View>
        </View>

        {/* Recently Completed Routines Section */}
        <View className="mt-6 w-full flex-1 align-items-center">
          <Text className="text-white text-lg font-semibold mb-2 text-center">Recently Completed Routines</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View className="flex-col pl-8">
              {/* Placeholder for recently completed routines */}
              {[...Array(10)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRoutinePress(`Routine ${index + 1}`)}
                  className="bg-gray-700 w-11/12 h-24 rounded-lg mb-2 justify-center items-center shadow-md active:opacity-70"
                >
                  <Text className="text-white">Routine {index + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </AppGradient>
  );
};

export default Profile;

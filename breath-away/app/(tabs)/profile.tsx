import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { getCurrentUser, signOut } from "@/lib/appwrite";
import Logout from "../../assets/icons/logout.png";
import AppGradient from "@/components/AppGradient";

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

  return (
    <AppGradient colors={["#161B2E", "#0A4D4A", "#766E67"]}>
      <View className="flex justify-between">
        <View className="flex-row justify-end w-full">
          <Text className="text-white pr-2 pt-1">Sign out</Text>
          <TouchableOpacity onPress={logout} className="flex mb-10">
            <Image source={Logout} resizeMode="contain" className="w-6 h-6" />
          </TouchableOpacity>
        </View>
        <View className="w-full items-center mt-5">
          <Text className="text-white text-3xl font-normal">
            Welcome{" "}
            <Text className="text-yellow-600 font-semibold">{username}</Text>
          </Text>
        </View>
      </View>
    </AppGradient>
  );
};
export default Profile;

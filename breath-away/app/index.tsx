import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Text, Image } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import CustomButton from "../components/CustomButton";
import LogoAndText from "../assets/images/logo.png";
import AppGradient from "@/components/AppGradient";

import { useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";

export default function App() {
  const data = useContext(GlobalContext);
  const { isLoading, isLoggedIn } = data;

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={LogoAndText}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center m-1">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary 200">BreathAway</Text>
            </Text>
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a journey of limetless
            exploration with BreathAway
          </Text>

          <CustomButton
            title="Continue with Email"
            onPress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </AppGradient>
  );
}

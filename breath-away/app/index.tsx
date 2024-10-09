import { ScrollView, View, Text, Image } from "react-native";
import { Redirect, router } from "expo-router";
import "react-native-url-polyfill/auto";
import CustomButton from "../components/CustomButton";
import Logo from "../assets/images/logo.png";
import AppGradient from "@/components/AppGradient";
import { useGlobalContext } from "../context/GlobalProvider";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <AppGradient colors={["#2E2E2E", "#424242", "#575757", "#6b6b6b"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={Logo}
            className="w-[195px] h-[126px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              <Text className="text-yellow-600">BreathAway</Text>
            </Text>
          </View>
          <Text className="text-base font-regular text-gray-100 mt-7 text-center">
            Embark on a journey of limitless exploration with breathing
            exercises for your every need
          </Text>

          <CustomButton
            title="Continue with Email"
            onPress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
    </AppGradient>
  );
}

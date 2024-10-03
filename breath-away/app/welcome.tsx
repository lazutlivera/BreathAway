import { View, Text } from "react-native";
import React from "react";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import logo from "../assets/images/logo.png";
import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";

const Welcome = () => {
  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View className="flex-1 justify-center items-center mt-10">
        <Image source={logo} className="w-36 h-36" />
      </View>
      <Text className="text-gray-200 font-medium text-4xl text-center">
        Welcome
      </Text>
      <Text className="text-gray-200 mb-3 font-light text-2xl text-center my-2">
        Please take caution when exercising breathwork. If you are new to
        breathwork, please find more information in our{" "}
        <Text
          onPress={() => {
            router.push("/(tabs)/faq");
          }}
          className="text-yellow-700"
        >
          FAQ
        </Text>
      </Text>
      <Text className="text-gray-200 mb-3 font-light text-2xl text-center my-5">
        Are you ready to explore?
      </Text>
      <CustomButton
        title="Let's go!"
        onPress={() => {
          router.push("/(tabs)/home");
        }}
        isLoading={false}
        containerStyles="shadow-xl shadow-yellow-700 my-20"
      ></CustomButton>
    </AppGradient>
  );
};

export default Welcome;

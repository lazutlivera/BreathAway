import { View, Text, ScrollView } from "react-native";
import React from "react";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Image } from "react-native";
import redSquare from "../assets/images/red-square.png";
import warning from "../assets/images/warning.png";
import { LinearGradient } from "expo-linear-gradient";

const Welcome = () => {
  return (
    <AppGradient colors={["#2E2E2E", "#424242", "#575757", "#6b6b6b"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-between items-center min-h-[85vh] px-4">
          <View className="relative mt-16">
            <Text className="text-3xl text-white font-light text-center mb-10">
              Welcome to BreathAway
            </Text>
          </View>
          <View>
            <Image
              source={redSquare}
              className="w-[290px] h-[350px] rounded-2xl bg-red-500"
            />
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
              className="absolute h-[350px] w-[290px] rounded-2xl flex justify-around items-center opacity-70"
            >
              <Image source={warning} className="w-[70px] h-[70px]" />
              <Text className="text-white text-2xl font-medium tracking-wide px-6 text-center">
                Take caution when exercising breathwork. If you are new to
                breathing routines, please find more information in our{" "}
                <Text
                  onPress={() => {
                    router.push("/(tabs)/faq");
                  }}
                  className="text-blue-950 font-medium"
                >
                  FAQ
                </Text>
              </Text>
            </LinearGradient>
          </View>

          <View>
            <Text className="text-xl font-light text-gray-100 mt-7 text-center mb-5">
              Ready to explore?
            </Text>

            <CustomButton
              title="Let's go!"
              onPress={() => router.push("/home")}
              containerStyles="mt-4 w-[290px]"
            />
          </View>
        </View>
      </ScrollView>
    </AppGradient>
  );
};

export default Welcome;

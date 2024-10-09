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
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-between items-center min-h-[85vh] px-4">
          <View className="relative mt-16">
            <Text className="text-3xl text-white font-bold text-center">
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
              className="absolute h-[350px] w-[290px] rounded-2xl flex justify-around items-center"
            >
              <Image source={warning} className="w-[70px] h-[70px]" />
              <Text className="text-white text-lg font-normal tracking-wide px-6 text-center">
                Take caution when exercising breathwork. If you are new to
                breathing routines, please find more information in our{" "}
                <Text
                  onPress={() => {
                    router.push("/(tabs)/faq");
                  }}
                  className="text-yellow-600 font-semibold"
                >
                  FAQ
                </Text>
              </Text>
            </LinearGradient>
          </View>

          <View>
            <Text className="text-base font-regular text-gray-100 mt-7 text-center">
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

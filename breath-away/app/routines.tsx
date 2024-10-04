import React from "react";
import { View, Text } from "react-native";
import AppGradient from "../components/AppGradient";

const Routines = () => {
  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">Routines</Text>
      </View>
    </AppGradient>
  );
};

export default Routines;

import { View, Text } from "react-native";
import React from "react";
import AppGradient from "@/components/AppGradient";
import { useState } from "react";

const Home = () => {
  const [routines, setRoutines] = useState([]);

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
    <View>
      <Text>Home</Text>
    </View>
    </AppGradient>
  );
};

export default Home;

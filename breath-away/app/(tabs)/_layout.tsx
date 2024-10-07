import React from "react";
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import * as Haptics from 'expo-haptics'
import { TouchableOpacity } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#161b2e" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                props.onPress?.();
              }}
            />
          ),
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
<Tabs.Screen
  name="faq"
  options={{
    tabBarButton: (props) => (
      <TouchableOpacity
        {...props}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          props.onPress?.();
        }}
      />
    ),
    tabBarLabel: "FAQ",
    tabBarIcon: ({ color }) => (
      <Entypo name="open-book" size={24} color={color} />
    ),
  }}
/>


      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                props.onPress?.();
              }}
            />
          ),
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Entypo name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="animation"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                props.onPress?.();
              }}
            />
          ),
          tabBarLabel: "Animation",
          tabBarIcon: ({ color }) => (
            <Entypo name="flower" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

<AntDesign name="home" size={24} color="black" />;

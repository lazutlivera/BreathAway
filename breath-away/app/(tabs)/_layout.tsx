import React from "react";
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import * as Haptics from "expo-haptics";
import { TouchableOpacity } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#6b6b6b" },
        tabBarIconStyle: { color: "#dbdbdb" },
        tabBarInactiveTintColor: "#dbdbdb",
        tabBarActiveTintColor: "#2E2E2E",
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
          tabBarLabelStyle: { fontSize: 18, fontWeight: 400 },
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
          tabBarLabelStyle: { fontSize: 18, fontWeight: 400 },
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
          tabBarLabelStyle: { fontSize: 18, fontWeight: 400 },
          tabBarIcon: ({ color }) => (
            <Entypo name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

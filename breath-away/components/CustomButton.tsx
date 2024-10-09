import { Text, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
  onPress: (e: any) => void;
  textStyles?: string;
  title: string;
  containerStyles?: string;
  isLoading?: boolean;
}

const CustomButton = ({
  title,
  onPress,
  containerStyles = "",
  textStyles = "",
  isLoading,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-transparent border-amber-500 border rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-white font-semibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

import React from "react";
import Content from "./Content";
import { LinearGradient } from "expo-linear-gradient";

const AppGradient = ({
  children,
  colors,
}: {
  children: any;
  colors: string[];
}) => {
  return (
    <LinearGradient colors={colors} className="flex-1">
      <Content>{children}</Content>
    </LinearGradient>
  );
};
export default AppGradient;

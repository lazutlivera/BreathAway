import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Text } from "react-native";
import AppGradient from "@/components/AppGradient";

const FlowerAnimation = () => {
  const instructions = ["inhale", "hold", "exhale"];
  const timing = [4000, 7000, 8000];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [instruction, setInstruction] = useState<string>(instructions[0]);
  const [time, setTime] = useState<number>(timing[0]);

  useEffect(() => {
    const updateInstructionAndTime = () => {
      const nextIndex = (currentIndex + 1) % instructions.length;

      setInstruction(instructions[nextIndex]);
      setTime(timing[nextIndex]);

      setCurrentIndex(nextIndex);
    };

    const interval = setInterval(updateInstructionAndTime, time);

    return () => clearInterval(interval);
  }, [currentIndex, time]);

  const petalAnim = useRef(new Animated.Value(0)).current;
  const petalAnim2 = useRef(new Animated.Value(0)).current;
  const petalAnim3 = useRef(new Animated.Value(0)).current;
  const petalAnim4 = useRef(new Animated.Value(0)).current;
  const petalAnim5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animatePetals = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(petalAnim, {
              toValue: 1,
              duration: timing[0],
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim2, {
              toValue: 1,
              duration: timing[0],
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim3, {
              toValue: 1,
              duration: timing[0],
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim4, {
              toValue: 1,
              duration: timing[0],
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim5, {
              toValue: 1,
              duration: timing[0],
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(timing[1]),
          Animated.timing(petalAnim, {
            toValue: 0,
            duration: timing[2] / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim2, {
            toValue: 0,
            duration: timing[2] / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim3, {
            toValue: 0,
            duration: timing[2] / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim4, {
            toValue: 0,
            duration: timing[2] / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim5, {
            toValue: 0,
            duration: timing[2] / 5,
            useNativeDriver: true,
          }),
          Animated.delay(0),
        ]),
        {
          iterations: -1,
        }
      ).start();
    };
    animatePetals();
  }, []);

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View className="flex-1 justify-center items-center">
        {/* Petal 1 */}
        <Animated.View
          className={
            instruction === "hold"
              ? "absolute bg-blue-700 opacity-75 w-32 h-32 rounded-full"
              : "absolute bg-blue-500 opacity-75 w-32 h-32 rounded-full"
          }
          style={{
            transform: [
              { rotate: "0deg" },
              {
                translateY: petalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
              {
                scale: petalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        />

        {/* Petal 2 */}
        <Animated.View
          className={
            instruction === "hold"
              ? "absolute bg-blue-700 opacity-75 w-32 h-32 rounded-full"
              : "absolute bg-blue-500 opacity-75 w-32 h-32 rounded-full"
          }
          style={{
            transform: [
              { rotate: "72deg" },
              {
                translateY: petalAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
              {
                scale: petalAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        />

        {/* Petal 3 */}
        <Animated.View
          className={
            instruction === "hold"
              ? "absolute bg-blue-700 opacity-75 w-32 h-32 rounded-full"
              : "absolute bg-blue-500 opacity-75 w-32 h-32 rounded-full"
          }
          style={{
            transform: [
              { rotate: "144deg" },
              {
                translateY: petalAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
              {
                scale: petalAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        />

        {/* Petal 4 */}
        <Animated.View
          className={
            instruction === "hold"
              ? "absolute bg-blue-700 opacity-75 w-32 h-32 rounded-full"
              : "absolute bg-blue-500 opacity-75 w-32 h-32 rounded-full"
          }
          style={{
            transform: [
              { rotate: "216deg" },
              {
                translateY: petalAnim4.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
              {
                scale: petalAnim4.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        />

        {/* Petal 5 */}
        <Animated.View
          className={
            instruction === "hold"
              ? "absolute bg-blue-700 opacity-75 w-32 h-32 rounded-full"
              : "absolute bg-blue-500 opacity-75 w-32 h-32 rounded-full"
          }
          style={{
            transform: [
              { rotate: "288deg" },
              {
                translateY: petalAnim5.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60],
                }),
              },
              {
                scale: petalAnim5.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          }}
        />
      </View>
      <View>
        <Text className="text-white text-4xl font-bold text-center mb-10">
          {instruction}
        </Text>
      </View>
    </AppGradient>
  );
};

export default FlowerAnimation;

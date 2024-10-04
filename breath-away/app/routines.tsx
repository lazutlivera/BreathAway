import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated } from "react-native";
import AppGradient from "../components/AppGradient";
import { useRoute } from "@react-navigation/native";
import { getRoutinesById } from "@/lib/appwrite";

interface Routine {
  inhale: number;
  exhale: number;
  hold: number | null;
  holdAfterExhale: number | null;
  secondInhale: number | null;
  $collectionId: string;
  $id: string;
  $createdAt: string;
  title: string;
  description: string;
  instructions: string;
  repeat: number;
  $databaseId: string;
  $permissions: [];
  $updatedAt: string;
}

const Routines = () => {
  const [time, setTime] = useState<number>(0);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [instruction, setInstruction] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // const [count, setCount] = useState<number>(0)

  const route = useRoute();
  const { title, id } = route.params as { title: string; id: string };

  useEffect(() => {
    getRoutinesById(id).then((result) => {
      setRoutine(result.documents[0] as Routine);
      setTime(result.documents[0].inhale * 1000);
      setInstruction("Inhale");
    });

    if (!routine) return;
  
    const instructions = ["Inhale", "Hold", "Exhale", "Hold"];
    const times = [
      routine.inhale,
      routine.hold,
      routine.exhale,
      routine.holdAfterExhale,
      routine.secondInhale,
    ];
  
    const updateInstructionAndTime = () => {
      const nextIndex = (currentIndex + 1) % instructions.length;
      setInstruction(instructions[nextIndex]);
      setTime((times[nextIndex] ?? 0) * 1000);
      setCurrentIndex(nextIndex);

  
 
    };
  
    const interval = setInterval(updateInstructionAndTime, time);
  
    clearInterval(interval);
  }, [id, currentIndex, instruction, time]);




  const petalAnim = useRef(new Animated.Value(0)).current;
  const petalAnim2 = useRef(new Animated.Value(0)).current;
  const petalAnim3 = useRef(new Animated.Value(0)).current;
  const petalAnim4 = useRef(new Animated.Value(0)).current;
  const petalAnim5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!routine) return;
    const animatePetals = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(petalAnim, {
              toValue: 1,
              duration: routine.inhale * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim2, {
              toValue: 1,
              duration: routine.inhale * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim3, {
              toValue: 1,
              duration: routine.inhale * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim4, {
              toValue: 1,
              duration: routine.inhale * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim5, {
              toValue: 1,
              duration: routine.inhale * 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay((routine.hold ?? 0) * 1000),
          Animated.timing(petalAnim, {
            toValue: 0,
            duration: (routine.exhale * 1000) / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim2, {
            toValue: 0,
            duration: (routine.exhale * 1000) / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim3, {
            toValue: 0,
            duration: (routine.exhale * 1000) / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim4, {
            toValue: 0,
            duration: (routine.exhale * 1000) / 5,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim5, {
            toValue: 0,
            duration: (routine.exhale * 1000) / 5,
            useNativeDriver: true,
          }),
          Animated.delay(
            routine.holdAfterExhale ? routine.holdAfterExhale * 1000 : 0
          ),
        ]),

        {
          iterations: routine.repeat ?? 1,
        }
      ).start();
    };
    animatePetals();
  }, [routine]);

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View className="flex-1 justify-center items-center">
        {/* Petal 1 */}
        <Animated.View
          className={
            instruction === "Hold"
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
            instruction === "Hold"
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
            instruction === "Hold"
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
            instruction === "Hold"
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
            instruction === "Hold"
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

export default Routines;

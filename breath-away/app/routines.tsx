import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import AppGradient from "@/components/AppGradient";
import Svg, { Circle } from "react-native-svg";
import { ReText } from "react-native-redash";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
  useAnimatedStyle,
  withDelay,
  cancelAnimation,
} from "react-native-reanimated";
import { useRoute } from "@react-navigation/native";
import AppwriteService from "@/lib/appwrite";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";

import LottieView from "lottie-react-native";
import back from "../assets/icons/left-arrow.png";

const strokeBackgroundColor = "#303858";
const strokeColor = "#ffa500";

const { width, height } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const circleLength = 800;
const R = circleLength / (2 * Math.PI);

interface Routine {
  inhale: number;
  exhale: number;
  hold: number | null;
  holdAfterExhale: number | null;
  secondInhale: number | null;
  $id: string;
  title: string;
  repeat: number;
  gradient: string[];
}

type BreathingPhase = "inhale" | "hold" | "exhale" | "holdAfterExhale";

const BreathingAnimation = () => {
  const animation = useRef<LottieView>(null);

  const route = useRoute();
  const { id } = route.params as { id: string };

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const progress = useSharedValue(0);
  const countdown = useSharedValue(0);
  const phase = useSharedValue<BreathingPhase>("inhale");
  const [currentSet, setCurrentSet] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const fadeAnim = useSharedValue(1);

  const fadeInOut = useCallback(() => {
    fadeAnim.value = withTiming(0, { duration: 250 }, () => {
      fadeAnim.value = withDelay(500, withTiming(1, { duration: 250 }));
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  useEffect(() => {
    AppwriteService.getCurrentUser()
      .then((user) => {
        if (user?.accountId) setCurrentUserId(user.accountId);
      })
      .catch((error) => {
        throw new Error(error);
      });

    AppwriteService.getRoutinesById(id).then((result) => {
      setRoutine(result.documents[0] as unknown as Routine);
      countdown.value = (result.documents[0] as unknown as Routine).inhale;
      setIsReady(true);
    });
  }, [id]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circleLength * (1 - progress.value),
  }));

  const progressText = useDerivedValue(
    () => `${Math.max(0, Math.floor(countdown.value))}`
  );

  const phaseText = useDerivedValue(() => {
    switch (phase.value) {
      case "inhale":
        return "Inhale";
      case "hold":
        return "Hold";
      case "exhale":
        return "Exhale";
      case "holdAfterExhale":
        return "Hold";
      default:
        return "Start";
    }
  });

  const runPhase = useCallback(
    (phaseName: BreathingPhase, duration: number): Promise<void> => {
      return new Promise((resolve) => {
        fadeInOut();

        phase.value = phaseName;
        countdown.value = duration;

        const targetProgress =
          phaseName === "inhale"
            ? 1
            : phaseName === "exhale"
            ? 0
            : progress.value;

        progress.value = withTiming(targetProgress, {
          duration: duration * 1000,
          easing: Easing.linear,
        });

        const interval = setInterval(() => {
          countdown.value = withTiming(countdown.value - 1, { duration: 100 });
          if (countdown.value <= 0) {
            clearInterval(interval);

            runOnJS(resolve)();
          }
        }, 1000);
      });
    },
    [fadeInOut, progress, countdown, phase]
  );

  const runCycle = useCallback(async () => {
    if (!routine) return;

    await runPhase("inhale", routine.inhale);

    if (routine.hold && routine.hold > 0) {
      await runPhase("hold", routine.hold);
    }

    await runPhase("exhale", routine.exhale);

    if (routine.holdAfterExhale && routine.holdAfterExhale > 0) {
      await runPhase("holdAfterExhale", routine.holdAfterExhale);
    }
  }, [runPhase, routine]);

  const startAnimation = useCallback(async () => {
    if (!routine || !currentUserId) return;
    setIsAnimating(true);
    for (let i = 0; i < routine.repeat; i++) {
      setCurrentSet(i + 1);
      await runCycle();
    }
    setIsAnimating(false);

    AppwriteService.saveCompletedRoutine(
      currentUserId,
      routine.$id,
      routine.title,
      new Date().toISOString()
    )
      .then(() => {
        setModalVisible(true);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [routine, currentUserId, runCycle]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);

    if (routine && routine.$id) {
      router.replace({
        pathname: "/routines",
        params: {
          id: routine.$id,
        },
      });
    }
  }, [routine]);

  if (!isReady) {
    return (
      <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-2xl">Loading...</Text>
        </View>
      </AppGradient>
    );
  }

  return (
    <AppGradient colors={routine!.gradient}>
      <View className="flex">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={back}
            className="ml-6 mt-3 w-[25px] h-[25px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-white text-center mt-4 font-bold text-2xl">
          {routine?.title}
        </Text>
      </View>
      <Text className="text-white text-xl text-center mt-10">
        Set {currentSet}/{routine?.repeat}
      </Text>
      <View className="flex-1 justify-center items-center mt-20 relative">
        <ReText
          className="text-6xl text-white opacity-70 text-center"
          text={progressText}
        />

        <Svg height={height} width={width} className="absolute">
          <Circle
            cx={width / 2}
            cy={height / 2}
            r={R}
            stroke={strokeBackgroundColor}
            strokeWidth={30}
            fill="none"
          />
          <AnimatedCircle
            cx={width / 2}
            cy={height / 2}
            r={R}
            strokeWidth={15}
            strokeDasharray={circleLength}
            fill="none"
            stroke={strokeColor}
            animatedProps={animatedProps}
            strokeLinecap={"round"}
          />
        </Svg>
      </View>
      <View className="flex-1 items-center">
        <View className="">
          <ReText
            className="text-4xl text-white opacity-70 text-center my-10"
            text={phaseText}
          />
        </View>
        <CustomButton
          title={isAnimating ? "Stop" : "Start"}
          onPress={isAnimating ? stopAnimation : startAnimation}
          containerStyles="mt-7 w-3/4"
          disabled={false}
        />
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="h-full w-full bg-[#2E2E2E] items-center p-5">
            <LottieView
              autoPlay
              ref={animation}
              style={{ width: width, height: height }}
              resizeMode="cover"
              source={require("../assets/anims/Animation - 1728484275418.json")}
            />
            <TouchableOpacity
              className="absolute top-20 right-8 z-10"
              onPress={() => setModalVisible(false)}
            >
              <Ionicons
                name="close"
                size={20}
                color="white"
                marginTop={5}
                marginRight={5}
              />
            </TouchableOpacity>
            <Text className="text-white font-semibold text-3xl absolute mt-60 text-center">
              Well done!
            </Text>
            <Text className="text-white font-semibold text-3xl absolute mt-72 text-center">
              You completed a routine
            </Text>

            <CustomButton
              title="Home"
              onPress={() => {
                router.push("/home");
                setModalVisible(false);
              }}
              containerStyles="mt-96 absolute px-8"
            />
          </View>
        </View>
      </Modal>
    </AppGradient>
  );
};

export default BreathingAnimation;

//`Set ${currentSet}/${routine?.repeat}`

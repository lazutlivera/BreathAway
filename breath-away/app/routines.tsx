import React, { useCallback, useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
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
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

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
        console.log("Current user ID:", user?.accountId);
      })
      .catch((error) => {
        console.log("Failed to fetch user:", error);
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

  const progressText = useDerivedValue(() => `${Math.ceil(countdown.value)}`);

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
            easing: Easing.inOut(Easing.cubic),
          });

          countdown.value = withTiming(
            0,
            {
              duration: duration * 1000,
              easing: Easing.linear,
            },
            () => {
              runOnJS(resolve)();
            }
          );
       
      });
    },
    [fadeInOut, progress, countdown, phase]
  );

  const runCycle = useCallback(async () => {
    if (!routine) return;
    await runPhase("inhale", routine.inhale);
    if (routine.hold) await runPhase("hold", routine.hold);
    await runPhase("exhale", routine.exhale);
    if (routine.holdAfterExhale) {
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

    console.log("Routine completed, saving...");
    AppwriteService.saveCompletedRoutine(
      currentUserId,
      routine.$id,
      routine.title,
      new Date().toISOString()
    )
      .then(() => {
        console.log("Routine successfully saved!");
      })
      .catch((error) => {
        console.log("Failed to save routine:", error);
      });
  }, [routine, currentUserId, runCycle]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    
    if (routine && routine.$id) {
      router.replace({
        pathname: "/routines",
        params: {
          id: routine.$id
        }
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
        <TouchableOpacity
          className="absolute bottom-8 w-6/12 h-16 bg-black opacity-50 rounded-3xl items-center justify-center"
          onPress={isAnimating ? stopAnimation : startAnimation
          }
        >
          <Text className="text-3xl text-white text-center tracking-wide">
            {isAnimating ? `Reset` : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </AppGradient>
  );
};

export default BreathingAnimation;

//`Set ${currentSet}/${routine?.repeat}`
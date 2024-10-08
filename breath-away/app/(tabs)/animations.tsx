import React, { useCallback, useState } from "react";
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
} from "react-native-reanimated";

const strokeBackgroundColor = "#303858";
const strokeColor = "#ffa500";

const { width, height } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const circleLength = 800;
const R = circleLength / (2 * Math.PI);

const routine = {
  inhale: 4,
  hold: 7,
  exhale: 8,
  holdAfterExhale: 4,
};

type BreathingPhase = "inhale" | "hold" | "exhale" | "holdAfterExhale";

const BreathingAnimation = ({ totalSets = 3 }) => {
  const progress = useSharedValue(0);
  const countdown = useSharedValue(routine.inhale);
  const phase = useSharedValue<BreathingPhase>("inhale");
  const [currentSet, setCurrentSet] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

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
    []
  );

  const runCycle = useCallback(async () => {
    await runPhase("inhale", routine.inhale);
    await runPhase("hold", routine.hold);
    await runPhase("exhale", routine.exhale);
    if (routine.holdAfterExhale > 0) {
      await runPhase("holdAfterExhale", routine.holdAfterExhale);
    }
  }, [runPhase]);

  const startAnimation = useCallback(async () => {
    setIsAnimating(true);
    for (let i = 0; i < totalSets; i++) {
      setCurrentSet(i + 1);
      await runCycle();
    }
    setIsAnimating(false);
  }, [totalSets, runCycle]);

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
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
          onPress={startAnimation}
          disabled={isAnimating}
        >
          <Text className="text-3xl text-white text-center tracking-wide">
            {isAnimating ? "In Progress" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>
    </AppGradient>
  );
};

export default BreathingAnimation;

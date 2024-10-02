import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import AppGradient from '@/components/AppGradient';

const FlowerAnimation = () => {

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
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim2, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim3, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim4, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(petalAnim5, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(2000),
          Animated.timing(petalAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim3, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim4, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(petalAnim5, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
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
          className="absolute bg-pink-500 opacity-75 w-32 h-32 rounded-full"
          style={{
            transform: [
              { rotate: '0deg' },
              { translateY: petalAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60],
              }) },
              { scale: petalAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }) }
            ],
          }}
        />

        {/* Petal 2 */}
        <Animated.View
          className="absolute bg-pink-500 opacity-75 w-32 h-32 rounded-full"
          style={{
            transform: [
              { rotate: '72deg' },
              { translateY: petalAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60],
              }) },
              { scale: petalAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }) }
            ],
          }}
        />

        {/* Petal 3 */}
        <Animated.View
          className="absolute bg-pink-500 opacity-75 w-32 h-32 rounded-full"
          style={{
            transform: [
              { rotate: '144deg' },
              { translateY: petalAnim3.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60],
              }) },
              { scale: petalAnim3.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }) }
            ],
          }}
        />

        {/* Petal 4 */}
        <Animated.View
          className="absolute bg-pink-500 opacity-75 w-32 h-32 rounded-full"
          style={{
            transform: [
              { rotate: '216deg' },
              { translateY: petalAnim4.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60],
              }) },
              { scale: petalAnim4.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }) }
            ],
          }}
        />

        {/* Petal 5 */}
        <Animated.View
          className="absolute bg-pink-500 opacity-75 w-32 h-32 rounded-full"
          style={{
            transform: [
              { rotate: '288deg' },
              { translateY: petalAnim5.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60],
              }) },
              { scale: petalAnim5.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }) }
            ],
          }}
        />
      </View>
    </AppGradient>
  );
};

export default FlowerAnimation;

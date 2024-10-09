import {
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalContext } from "@/context/GlobalProvider";
import GestureRecognizer from "react-native-swipe-gestures";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  item: any;
  index: number;
  scrollX: SharedValue<number>;
};

const { width } = Dimensions.get("screen");

const RoutineCard = ({ item, index, scrollX }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState<string>("");
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);
  const { showInstructions } = useGlobalContext();

  const handlePress = (routine: any) => {
    setSelectedRoutine(routine);
    setSelectedInstructions(routine.instructions);
    setModalVisible(true);
  };

  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      onSwipeDown={() => setModalVisible(false)}
    >
      <Animated.View
        className="justify-center items-center"
        style={[rnAnimatedStyle, styles.itemContainer]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (showInstructions) {
              handlePress(item);
            } else {
              router.push({
                pathname: `/routines`,
                params: { id: item.$id, title: item.title },
              });
            }
          }}
        >
          <Image
            source={{ uri: item.img }}
            className="w-[290px] h-[350px] rounded-2xl bg-blue-400"
          />
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
            className="absolute h-[350px] w-[290px] rounded-2xl flex justify-around items-center"
          >
            <Text className="text-slate-50 text-4xl font-medium tracking-wider drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {item.title}
            </Text>
            <Image source={{ uri: item.icon }} className="w-[70px] h-[70px]" />
            <Text className="text-white text-xl font-light tracking-wide px-8 text-center">
              {item.description}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end">
          <View className="max-h-3/4 bg-[#2E2E2E] rounded-t-3xl p-5 items-center relative">
            <TouchableOpacity
              className="absolute top-2 right-2 z-10"
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
            <View className="w-10 h-1 bg-white/30 rounded-full mb-5" />
            <ScrollView className="w-full">
              <Text className="text-white text-lg font-light mb-5 text-center">
                {selectedInstructions}
              </Text>
            </ScrollView>
            <View className="flex-row justify-center w-full mt-5">
              <TouchableOpacity
                className="bg-[#0a4d4a] p-4 rounded-lg flex-1 mb-3"
                onPress={() => {
                  if (selectedRoutine) {
                    router.push({
                      pathname: `/routines`,
                      params: {
                        id: selectedRoutine.$id,
                        title: selectedRoutine.title,
                      },
                    });
                    setModalVisible(false);
                  }
                }}
              >
                <Text className="text-white text-center font-normal text-2xl">
                  Start
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

export default RoutineCard;

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: width,
  },
});

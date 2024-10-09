import { Text, TouchableOpacity, View, ViewToken } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import AppGradient from "@/components/AppGradient";
import AppwriteService from "@/lib/appwrite";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Pagination from "@/components/Pagination";
import RoutineCard from "@/components/RoutineCard";
import { Switch } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Entypo } from "@expo/vector-icons";

const Home = () => {
  const [routines, setRoutines] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [showInfo, setShowInfo] = useState<Boolean>(false);

  useEffect(() => {
    AppwriteService.getRoutines().then((result: any) => {
      setRoutines(result.documents);
      setData(result.documents);
    });
  }, []);

  const { showInstructions, toggleShowInstructions } = useGlobalContext();
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems[0]?.index !== undefined &&
      viewableItems[0]?.index !== null
    ) {
      setPaginationIndex(viewableItems[0].index % 4);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const handleInfoToggle = () => {
    setShowInfo((prevShowInfo) => !prevShowInfo);
  };

  return (
    <AppGradient colors={["#2E2E2E", "#424242", "#575757", "#6b6b6b"]}>
      <View className="flex-row items-center mt-1">
        <Switch
          value={showInstructions}
          onValueChange={toggleShowInstructions}
          className="m-2 p-1"
        />
        <TouchableOpacity
          className="flex-row items-center justify-between"
          onPress={handleInfoToggle}
        >
          <Entypo name="info" size={20} color="white" />
          {showInfo && (
            <Text className="text-white p-2 font-light">
              Display Routine Instructions
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {routines.length > 0 && (
        <>
          <View className="flex-1 justify-center mt-24">
            <Animated.FlatList
              data={data}
              renderItem={({ item, index }) => (
                <RoutineCard item={item} index={index} scrollX={scrollX} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={onScrollHandler}
              viewabilityConfigCallbackPairs={
                viewabilityConfigCallbackPairs.current
              }
              onEndReached={() => setData((prev) => [...prev, ...routines])}
              onEndReachedThreshold={0.5}
            />
          </View>

          <Pagination
            items={routines}
            scrollX={scrollX}
            paginationIndex={paginationIndex}
          />
        </>
      )}
    </AppGradient>
  );
};

export default Home;

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
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View className="flex-row items-center mt-1">
        <Switch
          value={showInstructions}
          onValueChange={toggleShowInstructions}
          style={{ marginRight: 8, padding: 4 }}
          thumbColor={showInstructions ? "#ffffff" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          ios_backgroundColor="#767577"
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

      <View className="flex justify-center items-center p-12">
        <Text className="text-white text-lg font-light">
          Choose your state of mind
        </Text>
      </View>

      {routines.length > 0 && (
        <>
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

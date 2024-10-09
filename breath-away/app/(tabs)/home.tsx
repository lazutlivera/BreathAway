import { Text, View, ViewToken } from "react-native";
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
    if (viewableItems[0]?.index !== undefined) {
      setPaginationIndex(viewableItems[0].index % 4);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View className="flex-row items-center">
        <Switch
          value={showInstructions}
          onValueChange={toggleShowInstructions}
          className="mr-2"
        />
        <Entypo name="info" size={20} color="white" />
      </View>

      <View className="flex justify-center items-center p-16">
        <Text className="text-white text-lg">Select a routine to begin</Text>
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

import { View, StyleSheet } from "react-native";
import React from "react";
import { SharedValue } from "react-native-reanimated";

type Props = {
  items: any;
  paginationIndex: number;
  scrollX: SharedValue<number>;
};

const Pagination = ({ items, paginationIndex, scrollX }: Props) => {
  return (
    <View className="flex-row justify-center items-center mb-3">
      {items
        ? items.map((_: any, index: React.Key | null | undefined) => {
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      paginationIndex === index ? "#222" : "#aaa",
                  },
                ]}
              ></View>
            );
          })
        : null}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  dot: {
    backgroundColor: "#aaa",
    height: 8,
    width: 8,
    marginHorizontal: 2,
    borderRadius: 8,
  },
});

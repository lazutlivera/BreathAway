import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import AppGradient from "@/components/AppGradient";
import { AntDesign } from "@expo/vector-icons";
import faqData from "@/constants/faqData";
import { ScrollView } from "react-native";

type StateType = {
  [key: number]: boolean;
};

const Faq = () => {
  const [isOpenQuestions, setIsOpenQuestions] = useState<StateType>({});

  const toggleQuestion = (index: number) => {
    setIsOpenQuestions((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <>
      <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
        <View>
          <Text className="text-white text-2xl text-center mt-10 mb-5 font-light">
            Frequently Asked Questions
          </Text>
        </View>
        <ScrollView>
          <View className="m-4">
            {faqData.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  className="rounded-lg mb-3 flex-row justify-between"
                  onPress={() => toggleQuestion(index)}
                >
                  <Text className=" text-zinc-100 flex-row justify-between p-4 text-lg w-11/12 font-light">
                    {item.question}
                  </Text>
                  <View className="mt-5">
                    <AntDesign
                      name={isOpenQuestions[index] ? "up" : "down"}
                      size={20}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
                {isOpenQuestions[index] && (
                  <View className="rounded-lg p-3 mb-3 border-t-2 border-b-2 border-gray-400">
                    <Text className="text-zinc-300 text-lg font-light">
                      {item.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </AppGradient>
    </>
  );
};

export default Faq;

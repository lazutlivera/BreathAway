import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import AppGradient from "@/components/AppGradient";

import Logo from "../../assets/images/logo.png";
import { signIn } from "../../lib/appwrite";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      // setUser(result);
      // setIsLoggedIn(true);

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <Image
              source={Logo}
              resizeMode="contain"
              className="w-[115px] h-[85px]"
            />
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Log in to Aora
            </Text>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />
            <CustomButton
              title="Sign in"
              onPress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have an account?
              </Text>
              <Link
                href="/sign-up"
                className="text-lg font-psemibold text-secondary"
              >
                Sign up
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppGradient>
  );
};

export default SignIn;

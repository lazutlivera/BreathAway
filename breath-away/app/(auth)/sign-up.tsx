import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";

import Logo from "../../assets/images/logo.png";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { createUser } from "@/lib/appwrite";
import AppGradient from "@/components/AppGradient";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      router.replace("/welcome");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={Logo}
            resizeMode="contain"
            className="w-[115px] h-[85px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-semibold">
            Sign up to BreathAway
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
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
            title="Sign up"
            onPress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-yellow-600"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </AppGradient>
  );
};

export default SignUp;

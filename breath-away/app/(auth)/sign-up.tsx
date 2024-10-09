import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import Logo from "../../assets/images/logo.png";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import AppwriteService from "@/lib/appwrite";
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
      const result = await AppwriteService.createUser(
        form.email,
        form.password,
        form.username
      );
      router.replace("/welcome");
    } catch (error: any) {
      Alert.alert("Oops!", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppGradient colors={["#2E2E2E", "#424242", "#575757", "#6b6b6b"]}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <View className="flex justify-center items-center">
              <Image
                source={Logo}
                resizeMode="contain"
                className="w-[325px] h-[150px]"
              />
            </View>
            <Text className="text-2xl text-white text-semibold mt-9 font-semibold">
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
      </KeyboardAvoidingView>
    </AppGradient>
  );
};

export default SignUp;

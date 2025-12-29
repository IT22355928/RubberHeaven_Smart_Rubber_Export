import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Entypo,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import commonStyles from "@/styles/onboarding/common/common.styles";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [required, setRequired] = useState("");
  const [error, setError] = useState({
    password: "",
  });

  const handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordSpecialCharacter.test(password)) {
      setError({
        ...error,
        password: "Write at least one special character",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordOneNumber.test(password)) {
      setError({
        ...error,
        password: "Write at least one snumber",
      });
    } else if (!passwordSixValue.test(password)) {
      setError({
        ...error,
        password: "Write at least 6 characters",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else {
      setError({
        ...error,
        password: "",
      });
      setUserInfo({ ...userInfo, password: value });
    }
  };

  const handleSignIn = async () => {
    setButtonSpinner(true);
    try {
      const res = await axios.post(`${SERVER_URI}/login`, {
        email: userInfo.email,
        password: userInfo.password,
      });
      
      setButtonSpinner(false);
      await AsyncStorage.setItem("access_token", res.data.accessToken);
      await AsyncStorage.setItem("refresh_token", res.data.refreshToken);
      Toast.show("Login successful!", { type: "success" });
      router.push("/routes/home");
    } catch (error: any) {
      setButtonSpinner(false);
      const errorMsg = error.response?.data?.message || "Email or password is not correct!";
      Toast.show(errorMsg, { type: "danger" });
    }
  };

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Image
              style={styles.signInImage}
              source={require("@/assets/login/login.png")}
            />
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subwelcomeText}>
              Login to your existing account of RubberHeaven
            </Text>
            <View style={styles.inputContainer}>
              <View>
                <TextInput
                  style={[styles.input, { paddingLeft: 35 }]}
                  keyboardType="email-address"
                  value={userInfo.email}
                  placeholder="rubberheaven@gmail.com"
                  onChangeText={(value) =>
                    setUserInfo({ ...userInfo, email: value })
                  }
                />
                <Fontisto
                  style={{ position: "absolute", left: 26, top: 17.8 }}
                  name="email"
                  size={20}
                  color={"#A1A1A1"}
                />
                {required && (
                  <View style={commonStyles.errorContainer}>
                    <Entypo name="cross" size={18} color={"red"} />
                  </View>
                )}
                <View style={{ marginTop: 15 }}>
                  <TextInput
                    style={commonStyles.input}
                    keyboardType="default"
                    secureTextEntry={!isPasswordVisible}
                    defaultValue=""
                    placeholder="************"
                    onChangeText={handlePasswordValidation}
                  />
                  <TouchableOpacity
                    style={styles.visibleIcon}
                    onPress={() => setPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <Ionicons
                        name="eye-off-outline"
                        size={23}
                        color={"#747474"}
                      />
                    ) : (
                      <Ionicons
                        name="eye-outline"
                        size={23}
                        color={"#747474"}
                      />
                    )}
                  </TouchableOpacity>
                  <SimpleLineIcons
                    style={styles.icon2}
                    name="lock"
                    size={20}
                    color={"#A1A1A1"}
                  />
                </View>
                {error.password && (
                  <View style={[commonStyles.errorContainer, { top: 145 }]}>
                    <Entypo name="cross" size={18} color={"red"} />
                    <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                      {error.password}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => router.push("/routes/forget-password")}
              >
                <Text
                  style={[
                    styles.forgotSection,
                    { fontFamily: "Nunito_600SemiBold" },
                  ]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRadius: 8,
                  marginHorizontal: 16,
                  backgroundColor: "#2467EC",
                  marginTop: -15,
                }}
                onPress={handleSignIn}
              >
                {buttonSpinner ? (
                  <ActivityIndicator size="small" color={"white"} />
                ) : (
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: " Raleway_700Bold",
                    }}
                  >
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -15,
                  gap: 30,
                }}
              >
                <TouchableOpacity>
                  <View style={styles.iconWrapper}>
                    <Fontisto name="facebook" size={22} color="#1877F2" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={styles.iconWrapper}>
                    <Fontisto name="google" size={22} color="#DB4437" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={styles.iconWrapper}>
                    <Fontisto name="github" size={22} color="#181717" />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.signUpRedirect}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Raleway_600SemiBold",
                    fontWeight: 700,
                    marginTop: -40,
                  }}
                >
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push("/routes/sign-up")}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Raleway_600SemiBold",
                      color: "#2467EC",
                      marginLeft: 5,
                      marginTop: -40,
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  signInImage: {
    width: "100%",
    height: 310,
    alignSelf: "center",
    marginTop: 30,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#1E1E1E",
    marginTop: -5,
    marginBottom: 20,
    fontFamily: "Raleway_700Bold",
    lineHeight: 34,
  },

  subwelcomeText: {
    textAlign: "center",
    color: "#575757",
    fontSize: 16,
    marginTop: -10,
  },

  inputContainer: {
    marginHorizontal: 5,
    marginTop: 30,
    rowGap: 30,
  },

  input: {
    height: 55,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingLeft: 35,
    fontSize: 16,
    backgroundColor: "white",
    color: "#A1A1A1",
  },

  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },

  icon2: {
    position: "absolute",
    left: 24,
    top: 17.8,
    marginTop: -2,
  },

  forgotSection: {
    marginHorizontal: 16,
    textAlign: "right",
    fontSize: 16,
    marginTop: -20,
  },

  signUpRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
  },

  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#e0e7ff",
    marginHorizontal: 5,
  },
});

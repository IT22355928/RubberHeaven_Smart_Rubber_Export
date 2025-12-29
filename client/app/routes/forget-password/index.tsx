import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_400Regular,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  let [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleReset = () => {
    if (email.trim() === "") {
      alert("Please enter your registered email.");
      return;
    }
    alert("Password reset link sent to your email!");
    router.push("./verify-account");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/back.png")} 
      resizeMode="cover"
      style={styles.bgImage}
    >
      <LinearGradient
        colors={["rgba(229,236,249,0.2)", "rgba(246,247,249,0.2)"]}
        style={styles.overlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Enter your registered email address. We’ll send you a reset
                  link to recover your account.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleReset}>
                <LinearGradient
                  colors={["#4C8BF5", "#3461C1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("./login")}
                style={styles.backToLogin}
              >
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "Nunito_700Bold",
    color: "#1B2E66",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#6E7FA8",
    textAlign: "center",
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#1B2E66",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#000",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  button: {
    marginBottom: 20,
  },
  buttonGradient: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
  },
  backToLogin: {
    alignSelf: "center",
    marginTop: 5,
  },
  backToLoginText: {
    color: "#4C8BF5",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },
});

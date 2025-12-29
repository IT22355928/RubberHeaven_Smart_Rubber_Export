import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useRef, useState } from "react";
import Button from "@/components/button/button";
import { router } from "expo-router";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyAccountScreen() {
  const [code, setCode] = useState(new Array(4).fill(""));

  const inputs = useRef<any>(
    [...Array(4)].map(() => React.createRef<TextInput>())
  );

  const handleInput = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].current?.focus();
    }

    if (text === "" && index > 0) {
      inputs.current[index - 1].current?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = code.join("");
    const activation_token = await AsyncStorage.getItem("activation_token");

    try {
      const res = await axios.post(`${SERVER_URI}/activate-user`, {
        activation_token,
        activation_code: otp,
      });
      
      console.log(res);
      Toast.show("Your account activated successfully", { type: "success" });
      setCode(new Array(4).fill(""));
      router.push("/routes/login");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Your OTP is not valid or expired!";
      Toast.show(errorMsg, { type: "danger" });
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/back.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.headerText}>Verification Code</Text>
          <Text style={styles.subText}>
            We have sent the verification code to your mail
          </Text>
          <View style={styles.inputContainer}>
            {code.map((_, index) => (
              <TextInput
                key={index}
                style={styles.inputBox}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleInput(text, index)}
                value={code[index]}
                ref={inputs.current[index]}
                autoFocus={index === 0}
              />
            ))}
          </View>
          <View style={{ marginTop: 20 }}>
            <Button title="Submit" onPress={handleSubmit} />
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Go back to sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },

  subText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "center",
  },

  inputBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    marginRight: 10,
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: "#fff",
  },

  backText: {
    fontSize: 18,
    paddingTop: 20,
    fontWeight: "500",
    color: "#000",
  },
});

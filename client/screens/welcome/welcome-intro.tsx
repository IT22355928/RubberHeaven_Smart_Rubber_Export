import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import AppIntroSlider from "react-native-app-intro-slider";
import { onboardingSwiperData } from "@/constants/constans";
import { router } from "expo-router";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { LinearGradient } from "expo-linear-gradient";
import { styles as onboardStyles } from "@/styles/onboarding/onboard";
import commonStyles from "@/styles/onboarding/common/common.styles";

export default function WelcomeIntroScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  const renderItem = ({ item }: { item: onboardingSwiperDataType }) => {
    return (
      <LinearGradient
        colors={["#E5ECF9", "#F6F7F9", "#E8EEF9", "#DDE7F8"]}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        <View>
          <Image
            source={item.image}
            style={{
              alignSelf: "center",
              marginBottom: 30,
              width: 360,
              height: 400,
            }}
          />

          <Text style={[commonStyles.title, { fontFamily: "Raleway_700Bold" }]}>
            {item.title}
          </Text>
          <View style={{ marginTop: 15 }}>
            <Text
              style={[
                commonStyles.description,
                { fontFamily: "Raleway_700Bold" },
              ]}
            >
              {item.description}
            </Text>
            <Text
              style={[
                commonStyles.description,
                { fontFamily: "Raleway_700Bold" },
              ]}
            >
              {item.sortDescription}
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={onboardingSwiperData}
      onDone={() => {
        router.push("./login");
      }}
      onSkip={() => {
        router.push("./login");
      }}
      renderNextButton={() => (
        <View style={[commonStyles.welcomeButtonStyle, { marginBottom: 45 }]}>
          <Text
            style={[
              onboardStyles.buttonText,
              { fontFamily: "Raleway_700Bold" },
            ]}
          >
            Next
          </Text>
        </View>
      )}
      renderDoneButton={() => (
         <View style={[commonStyles.welcomeButtonStyle, { marginBottom: 45 }]}>
          <Text
            style={[
              onboardStyles.buttonText,
              { fontFamily: "Raleway_700Bold" },
            ]}
          >
            Done
          </Text>
        </View>
      )}
      showSkipButton={false}
      dotStyle={commonStyles.dotStyle}
      bottomButton={true}
      activeDotStyle={commonStyles.activeDotStyle}
    />
  );
}

const styles = StyleSheet.create({
  slideImage: {},
});

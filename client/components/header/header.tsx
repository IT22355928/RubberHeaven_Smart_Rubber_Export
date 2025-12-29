import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Raleway_700Bold } from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import useUser from "@/hooks/auth/useUser";
import { Feather } from "@expo/vector-icons";

export default function Header() {
  const { user } = useUser();

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("@/assets/icons/User.png")
            }
            style={styles.image}
          />
        </TouchableOpacity>
        <View>
          <Text style={[styles.helloText, { fontFamily: "Raleway_700Bold" }]}>
            Hello,
          </Text>
          <Text style={[styles.text, { fontFamily: "Raleway_700Bold" }]}>
            {user?.name}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bellButton}>
        <View>
          <Feather name="shopping-bag" size={26} color="black" />
          <View style={styles.bellContainer}></View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 45,
    height: 45,
    marginRight: 8,
    borderRadius: 100,
  },
  text: {
    fontSize: 16,
  },
  bellButton: {
    borderWidth: 1,
    borderColor: "#E1E2E5",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  bellIcon: {
    alignSelf: "center",
  },
  bellContainer: {
    width: 10,
    height: 10,
    backgroundColor: "#2467EC",
    position: "absolute",
    borderRadius: 50,
    right: 0,
    top: 0,
  },
  helloText: {
    color: "#7C7C80",
    fontSize: 14,
  },
});

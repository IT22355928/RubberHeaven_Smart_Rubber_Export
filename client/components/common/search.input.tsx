import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useFonts, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { AntDesign } from "@expo/vector-icons";

export default function SearchInput() {
  let [fontsLoaded, fontError] = useFonts({
    Nunito_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <View style={styles.filteringContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.input, { fontFamily: "Nunito_700Bold" }]}
          placeholder="Search"
          placeholderTextColor="#A3A3A3"
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <AntDesign name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  filteringContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },

  searchIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#2467EC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});

import { Image } from "react-native";
import { Tabs } from "expo-router";
import useUser from "@/hooks/auth/useUser";

export default function TabsLayout() {
  const { user } = useUser();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconSource;
          if (route.name === "index") {
            iconSource = require("@/assets/icons/HouseSimple.png");
          } else if (route.name === "search/index") {
            iconSource = require("@/assets/icons/search.png");
          } else if (route.name === "profile/index") {
            iconSource = user?.avatar || require("@/assets/icons/User.png");
          }

          return (
            <Image
              style={{ width: 25, height: 25, tintColor: color }}
              source={iconSource}
            />
          );
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="courses/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}

import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  firstContainer: {
    alignItems: "center",
    marginTop: -100,
  },

  logo: {
    width: wp("110%"),
    height: hp("65%"),
  },

  titleWrapper: {
    flexDirection: "row",
  },

  titleHeading: {
    fontSize: hp("5%"),
    textAlign: "center",
    top: 20,
    color: "#2467EC",
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
    paddingHorizontal: 10,
  },

  titleBody: {
    fontSize: hp("3.5%"),
    textAlign: "center",
    top: 55,
  },

  dscWrapper: {
    marginTop: 70,
  },

  dscpText: {
    textAlign: "center",
    color: "#575757",
    fontSize: hp("2%"),
  },

  buttonWrapper: {
    backgroundColor: "#2467EC",
    width: wp("90%"),
    paddingVertical: 18,
    borderRadius: 10,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: hp("2.5%"),
  },

  
});

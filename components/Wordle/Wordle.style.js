import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#5F9EA0",
    paddingVertical: 50,
  },
  inputContainer: {
    gap: 13,
    paddingHorizontal: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 13,
  },
  input: {
    width: 50,
    height: 50,
    fontSize: 24,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "white",
    textAlign: "center",
    color: "white",
    textTransform: "capitalize",
  },
  keyboardContainer: {
    padding: 10,
    // backgroundColor: "#ddd",
    // flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
  },
  keyboardRow: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
  keyboardBtn: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 3,
    width: 27,
    alignItems: "center",
  },
  keyboardDelBtn: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 3,
    width: 40,
    alignItems: "center",
  },
  keyText: {
    fontSize: 14,
    paddingHorizontal: 3,
    paddingVertical: 13,
    fontWeight: "bold",
  },
  submitBtn: {
    alignItems: "center",
  },
  submitBtnTxt: {
    backgroundColor: "blue",
    color: "white",
    padding: 13,
    borderRadius: 13,
    fontWeight: "bold",
  },
  // flagContainer: {
  //   paddingHorizontal: 13,
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   gap: 13,
  // },
  // flag: {
  //   width: 30,
  //   height: 30,
  // },
});

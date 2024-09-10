import { StyleSheet } from "react-native";
import Wordle from "./components/Wordle/Wordle";

export default function App() {
  return <Wordle />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

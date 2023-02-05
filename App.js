import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GameEngine } from "react-native-game-engine";

import { getRandom } from "./utils/random";
import entities from "./entities";
import Physics from "./physics";

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(null);
  useEffect(() => {
    if (currentPoints % 3 > 0 && currentPoints % 3 <= 1) {
      const intervalId = setInterval(() => {
        setBackgroundColor(
          `rgba(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(
            0,
            255
          )}, 0.7)`
        );
      }, 100);
      return () => clearInterval(intervalId);
    } else {
      setBackgroundColor("transparent");
    }
  }, [currentPoints]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("./assets/background.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          resizeMode: "cover",
        }}
      ></ImageBackground>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 40,
            fontWeight: "bold",
            margin: 20,
            color: "purple",
          }}
        >
          {currentPoints}
        </Text>
        <GameEngine
          ref={(ref) => {
            setGameEngine(ref);
          }}
          systems={[Physics]}
          entities={entities()}
          running={running}
          onEvent={(e) => {
            switch (e.type) {
              case "game_over":
                setRunning(false);
                gameEngine.stop();

                break;
              case "new_point":
                setCurrentPoints(currentPoints + 1);
                break;
            }
          }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <StatusBar style="auto" hidden={true} />
        </GameEngine>
        {!running ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "purple",
                paddingHorizontal: 30,
                paddingVertical: 20,
                borderRadius: 16,
              }}
              onPress={() => {
                setCurrentPoints(0);
                setRunning(true);
                gameEngine.swap(entities());
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 30, color: "pink" }}>
                START GAME
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

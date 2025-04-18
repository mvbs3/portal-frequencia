import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import HomeScreen from "./HomeScreen";
import { useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <Stack.Navigator>
      {!token ? (
        <Stack.Screen name="Login">
          {() => <LoginScreen />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Home">
          {() => <HomeScreen  />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

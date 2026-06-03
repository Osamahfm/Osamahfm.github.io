import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { COLORS, SIZES } from "../utils/constants";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ChatScreen from "../screens/ChatScreen";
import LoadingSpinner from "../components/LoadingSpinner";

const Stack = createNativeStackNavigator();

// ─── Auth Stack (not logged in) ────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: "fade",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─── Main Stack (logged in) ────────────────────────────────
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: SIZES.fontLg,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.username || "Chat",
          headerBackTitle: "Back",
        })}
      />
    </Stack.Navigator>
  );
}

// ─── Root Navigator ────────────────────────────────────────
export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/contexts/AuthContext";
import { WebSocketProvider } from "./src/contexts/WebSocketContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </WebSocketProvider>
    </AuthProvider>
  );
}

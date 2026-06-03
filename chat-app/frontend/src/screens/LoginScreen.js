import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { COLORS, SIZES } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      const message =
        error.response?.data?.detail || "Login failed. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>💬</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue chatting</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SIZES.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: SIZES.xxl,
  },
  logo: {
    fontSize: 56,
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.fontTitle,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
  },
  form: {
    gap: SIZES.md,
  },
  inputGroup: {
    gap: SIZES.xs,
  },
  label: {
    fontSize: SIZES.fontSm,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginLeft: SIZES.xs,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    color: COLORS.inputText,
    fontSize: SIZES.fontMd,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md + 2,
    borderRadius: SIZES.radiusMd,
    alignItems: "center",
    marginTop: SIZES.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: SIZES.fontLg,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMd,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: SIZES.fontMd,
    fontWeight: "600",
  },
});

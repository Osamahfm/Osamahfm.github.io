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
  ScrollView,
  Animated,
} from "react-native";
import { COLORS, SIZES } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = async () => {
    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation", "Please fill in all fields");
      return;
    }
    if (username.trim().length < 3) {
      Alert.alert("Validation", "Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register(username.trim(), email.trim(), password);
    } catch (error) {
      const message =
        error.response?.data?.detail || "Registration failed. Please try again.";
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>✨</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the conversation</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="your_username"
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={50}
              />
            </View>

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
                placeholder="Min. 6 characters"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: SIZES.xl,
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

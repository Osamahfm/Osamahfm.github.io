import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { COLORS, SIZES } from "../utils/constants";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.placeholder}
          multiline
          maxLength={5000}
          returnKeyType="default"
          blurOnSubmit={false}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.sendButton,
          text.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
        ]}
        onPress={handleSend}
        disabled={!text.trim()}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.sendIcon,
            text.trim() ? styles.sendIconActive : styles.sendIconInactive,
          ]}
        >
          ↑
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: SIZES.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radiusXl,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.md,
    paddingVertical: Platform.OS === "ios" ? SIZES.sm + 2 : 0,
    minHeight: 44,
    justifyContent: "center",
  },
  input: {
    color: COLORS.inputText,
    fontSize: SIZES.fontMd,
    maxHeight: 100,
    paddingTop: Platform.OS === "android" ? SIZES.sm : 0,
    paddingBottom: Platform.OS === "android" ? SIZES.sm : 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 2 : 0,
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sendButtonInactive: {
    backgroundColor: COLORS.surfaceLight,
  },
  sendIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  sendIconActive: {
    color: COLORS.textPrimary,
  },
  sendIconInactive: {
    color: COLORS.textMuted,
  },
});

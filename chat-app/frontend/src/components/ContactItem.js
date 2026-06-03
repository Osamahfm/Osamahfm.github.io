import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../utils/constants";

export default function ContactItem({ user, isOnline, onPress }) {
  const initials = user.username
    .split(/[_\s]/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isOnline ? COLORS.online : COLORS.offline },
          ]}
        />
      </View>

      {/* User Info */}
      <View style={styles.info}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.status}>
          {isOnline ? "Online" : "Offline"}
        </Text>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatarContainer: {
    position: "relative",
    marginRight: SIZES.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: COLORS.textPrimary,
    fontSize: SIZES.fontLg,
    fontWeight: "700",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  info: {
    flex: 1,
  },
  username: {
    color: COLORS.textPrimary,
    fontSize: SIZES.fontMd,
    fontWeight: "600",
  },
  status: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontSm,
    marginTop: 2,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 24,
    fontWeight: "300",
  },
});

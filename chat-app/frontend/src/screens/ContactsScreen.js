import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SIZES } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";
import { useWebSocket } from "../contexts/WebSocketContext";
import { getUsers } from "../api/endpoints";
import ContactItem from "../components/ContactItem";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ContactsScreen({ navigation }) {
  const { logout, user } = useAuth();
  const { isConnected, onlineUsers } = useWebSocket();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Refresh contacts each time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const openChat = (contact) => {
    navigation.navigate("Chat", {
      userId: contact.id,
      username: contact.username,
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.username} 👋</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.connDot,
                {
                  backgroundColor: isConnected
                    ? COLORS.online
                    : COLORS.error,
                },
              ]}
            />
            <Text style={styles.connText}>
              {isConnected ? "Connected" : "Reconnecting..."}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Contacts</Text>
        <Text style={styles.sectionCount}>{users.length} people</Text>
      </View>

      {/* Contact List */}
      {users.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyTitle}>No contacts yet</Text>
          <Text style={styles.emptySubtitle}>
            When other users join, they'll appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactItem
              user={item}
              isOnline={onlineUsers.has(item.id) || item.is_online}
              onPress={() => openChat(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={users.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xxl + SIZES.md,
    paddingBottom: SIZES.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  greeting: {
    fontSize: SIZES.fontXl,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  connDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
  },
  logoutBtn: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.surfaceLight,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: SIZES.fontSm,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sectionCount: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.md,
  },
  emptyTitle: {
    fontSize: SIZES.fontXl,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  emptySubtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS, SIZES } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";
import { useWebSocket } from "../contexts/WebSocketContext";
import { getMessageHistory } from "../api/endpoints";
import ChatBubble from "../components/ChatBubble";
import MessageInput from "../components/MessageInput";

export default function ChatScreen({ route }) {
  const { userId, username } = route.params;
  const { user } = useAuth();
  const { sendMessage, addMessageListener } = useWebSocket();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

  // ─── Load message history ──────────────────────────────
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getMessageHistory(userId);
        setMessages(history);
      } catch (error) {
        console.error("Failed to load messages:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [userId]);

  // ─── Listen for real-time messages ─────────────────────
  useEffect(() => {
    const unsubscribe = addMessageListener(`chat-${userId}`, (data) => {
      // Only add messages relevant to this conversation
      if (data.sender_id === userId || data.receiver_id === userId) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      }
    });

    return unsubscribe;
  }, [userId, addMessageListener]);

  // ─── Auto-scroll to bottom on new messages ─────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // ─── Send handler ──────────────────────────────────────
  const handleSend = useCallback(
    (content) => {
      sendMessage(userId, content);
    },
    [userId, sendMessage]
  );

  const renderMessage = ({ item }) => (
    <ChatBubble message={item} isOwn={item.sender_id === user?.id} />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            Say hello to {username}!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messageList: {
    paddingVertical: SIZES.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontMd,
  },
  emptyContainer: {
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

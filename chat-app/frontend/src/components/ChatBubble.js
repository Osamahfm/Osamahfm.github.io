import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../utils/constants";

export default function ChatBubble({ message, isOwn }) {
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={[
        styles.wrapper,
        isOwn ? styles.wrapperOwn : styles.wrapperOther,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
        ]}
      >
        <Text
          style={[
            styles.content,
            isOwn ? styles.contentOwn : styles.contentOther,
          ]}
        >
          {message.content}
        </Text>
        <View style={styles.metaRow}>
          <Text
            style={[
              styles.time,
              isOwn ? styles.timeOwn : styles.timeOther,
            ]}
          >
            {time}
          </Text>
          {isOwn && (
            <Text style={styles.checkmark}>
              {message.is_read ? "✓✓" : "✓"}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 3,
    marginHorizontal: SIZES.md,
  },
  wrapperOwn: {
    alignItems: "flex-end",
  },
  wrapperOther: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm + 2,
    borderRadius: SIZES.radiusLg,
  },
  bubbleOwn: {
    backgroundColor: COLORS.sentBubble,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.receivedBubble,
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: SIZES.fontMd,
    lineHeight: 21,
  },
  contentOwn: {
    color: COLORS.sentText,
  },
  contentOther: {
    color: COLORS.receivedText,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: SIZES.fontXs,
  },
  timeOwn: {
    color: "rgba(255,255,255,0.6)",
  },
  timeOther: {
    color: COLORS.textMuted,
  },
  checkmark: {
    fontSize: SIZES.fontXs,
    color: "rgba(255,255,255,0.6)",
  },
});

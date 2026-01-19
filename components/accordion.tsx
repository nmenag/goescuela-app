import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    TouchableOpacity,
    UIManager
} from "react-native";

const COLORS = {
  primary: "#FAE0F0",
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  duration?: number;
}

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ThemedView style={styles.container}>
      {items.map((item) => (
        <ThemedView key={item.id} style={styles.itemContainer}>
          <TouchableOpacity
            style={[
              styles.header,
              expandedId === item.id && styles.headerExpanded,
            ]}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.headerLeft}>
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              {item.duration && (
                <ThemedText style={styles.duration}>
                  {item.duration} min
                </ThemedText>
              )}
            </ThemedView>
            <ThemedText
              style={[
                styles.chevron,
                expandedId === item.id && styles.chevronExpanded,
              ]}
            >
              ›
            </ThemedText>
          </TouchableOpacity>

          {expandedId === item.id && (
            <ThemedView style={styles.content}>{item.content}</ThemedView>
          )}
        </ThemedView>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  itemContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.primary,
    transform: [{ rotate: "0deg" }],
  },
  chevronExpanded: {
    transform: [{ rotate: "90deg" }],
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F9FAFB",
  },
});

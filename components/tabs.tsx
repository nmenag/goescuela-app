import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BrandingColors } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
  primary: BrandingColors.hotPink,
  text: "#1F2937",
  textLight: "#6B7280",
  border: "#E5E7EB",
};

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId }) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  return (
    <ThemedView style={styles.container}>
      {/* Tab Headers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsHeader}
        scrollEventThrottle={16}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </ThemedText>
            {activeTab === tab.id && (
              <ThemedView style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <ThemedView style={styles.content}>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textLight,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -12,
    height: 3,
    width: "100%",
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
  },
});

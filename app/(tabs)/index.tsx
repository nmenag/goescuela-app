import { Image } from "expo-image";
import { BookOpen, Heart, Zap } from "lucide-react-native";
import { Platform, StyleSheet, View } from "react-native";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome Go escuela!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* NativeWind & Tailwind CSS Demo */}
      <View className="px-4 py-4">
        <Card
          title="🎉 NativeWind Enabled"
          description="This app now uses Tailwind CSS with NativeWind for styling!"
        >
          <View className="flex-row gap-3">
            <View className="flex-1">
              <View className="bg-blue-100 dark:bg-blue-900 rounded-md p-3 items-center">
                <Zap size={24} color="#3B82F6" className="mb-2" />
                <ThemedText className="text-center text-sm font-semibold">
                  Fast
                </ThemedText>
              </View>
            </View>
            <View className="flex-1">
              <View className="bg-green-100 dark:bg-green-900 rounded-md p-3 items-center">
                <Heart size={24} color="#10B981" className="mb-2" />
                <ThemedText className="text-center text-sm font-semibold">
                  Beautiful
                </ThemedText>
              </View>
            </View>
            <View className="flex-1">
              <View className="bg-purple-100 dark:bg-purple-900 rounded-md p-3 items-center">
                <BookOpen size={24} color="#A855F7" className="mb-2" />
                <ThemedText className="text-center text-sm font-semibold">
                  Simple
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <Card
          title="🎨 Lucide Icons"
          description="Beautiful icons integrated with your app"
        >
          <View className="gap-3">
            <Button title="Primary Button" variant="primary" />
            <Button title="Secondary Button" variant="secondary" />
            <Button title="Outline Button" variant="outline" />
          </View>
        </Card>
      </View>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              title="Action"
              icon="cube"
              onPress={() => alert("Action pressed")}
            />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert("Share pressed")}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert("Delete pressed")}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">
            npm run reset-project
          </ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

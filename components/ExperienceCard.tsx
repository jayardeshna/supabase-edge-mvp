import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Experience } from "@/types";
import { Colors } from "@/constants/theme";
import EvilIcons from "@expo/vector-icons/EvilIcons";

interface ExperienceCardProps {
  item: Experience;
  theme: typeof Colors.light;
}

export function ExperienceCard({ item, theme }: ExperienceCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: theme.background }]}>
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.cardImage}
          contentFit="cover"
        />
      )}
      <View style={styles.cardContent}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        <View style={styles.coords}>
          <EvilIcons name="location" size={24} color="#999" />
          <Text style={styles.coordsText}>
            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  cardImage: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  coords: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  coordsText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "600",
  },
});

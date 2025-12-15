import { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useExperiences } from "@/hooks/useExperiences";
import { ExperienceCard } from "@/components/ExperienceCard";
import { AuthForm } from "@/components/AuthForm";
import { Colors } from "@/constants/theme";

export default function ExperiencesScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme as keyof typeof Colors];

  const { session } = useAuth();
  const {
    experiences,
    loading: fetching,
    fetchExperiences,
  } = useExperiences(session?.access_token);

  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClearFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleAuth = async (type: "LOGIN" | "SIGNUP") => {
    setAuthLoading(true);
    try {
      const { error, data } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      handleClearFields();
      if (type === "SIGNUP")
        Alert.alert(
          "Success",
          "Your account has been created successfully. and you are logged in"
        );
    } catch (err: any) {
      Alert.alert("Auth Error", err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchExperiences();
    }
  }, [session, fetchExperiences]);

  if (!session) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <AuthForm
          theme={theme}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={authLoading}
          onLogin={() => handleAuth("LOGIN")}
          onSignup={() => handleAuth("SIGNUP")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Experiences</Text>
          <Text style={[styles.userEmail, { color: theme.text }]}>
            {session.user.email}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => supabase.auth.signOut()}
          style={styles.signOutButton}
        >
          <Text style={styles.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {experiences.length === 0 && !fetching && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No experiences loaded
          </Text>
        </View>
      )}

      <FlatList
        data={experiences}
        renderItem={({ item }) => <ExperienceCard item={item} theme={theme} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={fetching}
        onRefresh={fetchExperiences}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  userEmail: { fontSize: 12, opacity: 0.6, marginTop: 4 },
  buttonDisabled: { opacity: 0.5 },
  signOutButton: {
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ffebee",
    borderRadius: 6,
  },
  signOut: { color: "#c62828", fontWeight: "600" },
  list: { paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", fontSize: 16, marginBottom: 8 },
});

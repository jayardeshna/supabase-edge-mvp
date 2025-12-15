import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/theme";

interface AuthFormProps {
  theme: typeof Colors.light;
  email: string;
  setEmail: (text: string) => void;
  password: string;
  setPassword: (text: string) => void;
  loading: boolean;
  onLogin: () => void;
  onSignup: () => void;
}

export function AuthForm({
  theme,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onLogin,
  onSignup,
}: AuthFormProps) {
  return (
    <View style={styles.authContainer}>
      <Text style={[styles.title, { color: theme.text, fontSize: 32 }]}>
        Experiences MVP
      </Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Sign in to view secure locations
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
          placeholder="Email"
          placeholderTextColor={theme.subtext}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
          placeholder="Password"
          placeholderTextColor={theme.subtext}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.secondaryButton,
          loading && styles.buttonDisabled,
        ]}
        onPress={onSignup}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 30,
    opacity: 0.7,
    textAlign: "center",
    fontSize: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0a7ea4",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#0a7ea4",
    fontWeight: "600",
    fontSize: 16,
  },
});

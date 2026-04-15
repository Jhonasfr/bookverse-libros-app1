import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { session, isBooting } = useAuth();

  if (isBooting) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1F3A5F" />
      </View>
    );
  }

  if (!session?.token) return <Redirect href="/auth/login" />;

  return <Redirect href="/products" />;
}

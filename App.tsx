import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./src/hooks/useAuth";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import SubscriptionsListScreen from "./src/screens/SubscriptionList";
import AddSubscriptionScreen from "./src/screens/AddSubscription";
import { RootStackParamList } from "./src/lib/navigation.types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        {session ? (
          <>
            <Stack.Screen
              name="Subscriptions"
              component={SubscriptionsListScreen}
              options={{
                title: "My Subscriptions",
              }}
            />

            <Stack.Screen
              name="AddSubscription"
              component={AddSubscriptionScreen}
              options={{
                title: "New Subscription",
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

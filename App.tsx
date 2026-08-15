import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAuthSession } from "./src/features/auth/hooks/useAuthSession";
import LoginScreen from "./src/features/auth/screens/LoginScreen";
import AddSubscriptionScreen from "./src/features/subscriptions/screens/AddSubscriptionScreen";
import SubscriptionsListScreen from "./src/features/subscriptions/screens/SubscriptionListScreen";
import { RootStackParamList } from "./src/shared/lib/navigation.types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { session, loading } = useAuthSession();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}

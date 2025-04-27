import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Função para os ícones da barra de abas
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Componente para o cabeçalho personalizado
function CustomHeader({ title }: { title: string }) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Link href="/modal" asChild>
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="info-circle"
              size={25}
              color="#fff"
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      </Link>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        // Usar cabeçalho personalizado
        header: ({ route }) => {
          // Título com base na rota
          let title = "Controle de Presença";
          if (route.name === "LoginScreen") {
            title = "Login";
          }
          return <CustomHeader title={title} />;
        },
      }}
      // Definir LoginScreen como tela inicial (porque é a tela de entrada do usuário)
      initialRouteName="LoginScreen"
    >
      {/* Esconda as abas originais */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Oculta a aba
        }}
      />

      {/* Adicione suas duas telas principais */}
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="LoginScreen"
        options={{
          title: "Login",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="sign-in" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});

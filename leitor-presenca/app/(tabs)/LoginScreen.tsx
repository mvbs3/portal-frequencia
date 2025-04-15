// screens/LoginScreen.tsx
import { View, Button, Text, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

type Props = {
  onLoginSuccess: (token: string) => void;
};

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  // URL do seu servidor Flask - atualize para o endereço real
  const FLASK_SERVER_URL = "https://a059-190-171-84-113.ngrok-free.app";

  // Função para iniciar o fluxo de autenticação
  const handleLogin = async () => {
    try {
      setLoading(true);

      // URL para onde o servidor Flask deve redirecionar após a autenticação
      const redirectUrl = Linking.createURL("login-callback");

      // URL para iniciar o fluxo de autenticação
      const authUrl = `${FLASK_SERVER_URL}/auth?redirect_uri=${encodeURIComponent(
        redirectUrl
      )}`;

      // Abre o navegador para autenticação
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      if (result.type === "success") {
        // Extrai o token da URL de callback
        const url = new URL(result.url);
        const token = url.searchParams.get("token");

        if (token) {
          // Notifica sobre o sucesso do login e navega para a tela inicial
          onLoginSuccess(token);
          router.replace({
            pathname: "/HomeScreen",
            params: { token: token },
          });
        } else {
          Alert.alert("Erro", "Não foi possível obter o token de autenticação");
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  // Configura o manipulador de URL para caso o app seja aberto via deep link
  useEffect(() => {
    // Define a função que será chamada quando uma URL abrir o app
    const handleUrl = ({ url }: { url: string }) => {
      if (url.includes("login-callback")) {
        const parsedUrl = new URL(url);
        const token = parsedUrl.searchParams.get("token");

        if (token) {
          onLoginSuccess(token);
          router.replace({
            pathname: "/HomeScreen",
            params: { token: token },
          });
        }
      }
    };

    // Registra o listener para eventos de URL
    const subscription = Linking.addEventListener("url", handleUrl);

    // Verifica se o app foi aberto por uma URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });

    // Limpa o listener quando o componente for desmontado
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Faça login para continuar
      </Text>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Autenticando...</Text>
        </View>
      ) : (
        <Button title="Entrar com Google" onPress={handleLogin} />
      )}
    </View>
  );
}

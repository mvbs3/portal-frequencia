import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const [spreadsheetLink, setSpreadsheetLink] = useState("");

  const extractSpreadsheetId = (link: string) => {
    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const handleContinue = () => {
    const spreadsheetId = extractSpreadsheetId(spreadsheetLink.trim());

    if (spreadsheetId) {
      router.replace({
        pathname: "/HomeScreen",
        params: { spreadsheetId: spreadsheetId },
      });
    } else {
      Alert.alert(
        "Link inválido",
        "Não foi possível extrair o ID da planilha."
      );
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text style={{ marginBottom: 10, fontSize: 16 }}>
        Cole o link da sua planilha:
      </Text>
      <TextInput
        value={spreadsheetLink}
        onChangeText={setSpreadsheetLink}
        placeholder="https://docs.google.com/spreadsheets/..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
      />
      <Button title="Continuar" onPress={handleContinue} />
    </View>
  );
}

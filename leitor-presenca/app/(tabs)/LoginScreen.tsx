import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { checarPresenca } from "../api";
import registrarFaltaEmMassa from "../api";
import PresencaStatusComponent from "../PresencaStatusComponent";

const LoginScreen: React.FC = () => {
  const [spreadsheetLink, setSpreadsheetLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractSpreadsheetId = (link: string): string | null => {
    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const handleContinue = (): void => {
    const spreadsheetId = extractSpreadsheetId(spreadsheetLink.trim());
    if (spreadsheetId) {
      router.replace({
        pathname: "/(tabs)/HomeScreen",
        params: { spreadsheetId: spreadsheetId },
      });
    } else {
      Alert.alert(
        "Link inválido",
        "Não foi possível extrair o ID da planilha."
      );
    }
  };

  const handleRegistrarFalta = async (): Promise<void> => {
    const spreadsheetId = extractSpreadsheetId(spreadsheetLink.trim());
    if (spreadsheetId) {
      setIsLoading(true);
      try {
        const resultado = await registrarFaltaEmMassa(spreadsheetId);
        Alert.alert("Sucesso", "Falta registrada para todos os alunos");
        console.log(resultado);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível registrar as faltas");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        "Link inválido",
        "Não foi possível extrair o ID da planilha."
      );
    }
  };

  const handleClearText = (): void => {
    setSpreadsheetLink("");
  };

  // Verifica se o spreadsheetId é válido
  const isValidSpreadsheetId =
    extractSpreadsheetId(spreadsheetLink.trim()) !== null;

  return (
    <View style={styles.container}>
      {/* Componente de status de presença adicionado aqui */}
      <PresencaStatusComponent />

      <Text style={styles.title}>Controle de Presença</Text>

      <Text style={styles.label}>Cole o link da sua planilha:</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={spreadsheetLink}
          onChangeText={setSpreadsheetLink}
          placeholder="https://docs.google.com/spreadsheets/..."
          placeholderTextColor="#888"
          style={styles.input}
          multiline={true}
          numberOfLines={2}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {spreadsheetLink.length > 0 && (
          <TouchableOpacity onPress={handleClearText}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {spreadsheetLink.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Link inserido:</Text>
          <Text
            style={styles.previewText}
            numberOfLines={2}
            ellipsizeMode="middle"
          >
            {spreadsheetLink}
          </Text>
        </View>
      )}

      <Button
        title="Continuar"
        onPress={handleContinue}
        color="#4285F4"
        disabled={!isValidSpreadsheetId || isLoading}
      />

      {/* Botão para registrar falta em todos os alunos - só aparece quando há um link válido */}
      {isValidSpreadsheetId && (
        <TouchableOpacity
          style={styles.faltaButton}
          onPress={handleRegistrarFalta}
          disabled={isLoading}
        >
          <Text style={styles.faltaButtonText}>
            {isLoading ? "Registrando..." : "Colocar falta em todos alunos"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f8f8f8",
  },
  clearButton: {
    padding: 10,
    color: "#888",
    fontSize: 16,
  },
  previewContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  previewText: {
    fontSize: 14,
    color: "#333",
  },
  faltaButton: {
    marginTop: 15,
    backgroundColor: "#FF5252",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  faltaButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;

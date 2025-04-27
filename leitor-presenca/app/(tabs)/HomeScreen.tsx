import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import { checarPresenca } from "../api";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import PresencaStatusComponent from "../PresencaStatusComponent";

export default function HomeScreen() {
  const { spreadsheetId } = useLocalSearchParams();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const playBeep = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sound/beep.mp3")
    );
    await sound.playAsync();
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    await playBeep();
    if (data) {
      const nome = data.replace("nota:", "").trim();
      const resposta = await checarPresenca(nome, spreadsheetId as string);
      Alert.alert("Resultado", resposta);
    } else {
      Alert.alert("QR inválido", 'O QR Code não começa com "nota:".');
    }
    setTimeout(() => setScanned(false), 3000);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {/* Adicionando o componente de status de presença no topo */}
      <SafeAreaView style={styles.statusContainer}>
        <PresencaStatusComponent />
      </SafeAreaView>

      <CameraView
        style={styles.camera}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        facing={facing}
      >
        {/* Mira de QR Code */}
        <View style={styles.overlay}>
          <View style={styles.qrFrame} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  overlay: {
    position: "absolute",
    top: "25%", // ajusta verticalmente pra mais perto do centro
    left: 0,
    right: 0,
    alignItems: "center",
  },
  qrFrame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: "white",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  // Estilo para o container do componente de status
  statusContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 10,
    position: "absolute",
    top: 0,
    zIndex: 10, // Garante que o status fique sobreposto à câmera
  },
});

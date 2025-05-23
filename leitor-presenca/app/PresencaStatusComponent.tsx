import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const PresencaStatusComponent: React.FC = () => {
  const [dentroHorario, setDentroHorario] = useState<boolean>(false);
  const [horaAtual, setHoraAtual] = useState<Date>(new Date());
  const [isSabado, setIsSabado] = useState<boolean>(false);

  useEffect(() => {
    // Função para verificar se está dentro do horário permitido
    const verificarHorario = (): void => {
      const agora = new Date();
      const horas = agora.getHours();
      const minutos = agora.getMinutes();
      const tempoAtual = horas * 60 + minutos; // Converter para minutos desde meia-noite
      const diaDaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

      const ehSabado = diaDaSemana === 6;
      setIsSabado(ehSabado);

      let primeiroInicio, primeiroFim, segundoInicio, segundoFim;

      // Definir horários permitidos (em minutos desde meia-noite)
      if (ehSabado) {
        // Horários para sábado
        primeiroInicio = 7 * 60 + 30; // 7:30
        primeiroFim = 8 * 60 + 30; // 8:30
        segundoInicio = 9 * 60 + 45; // 9:45
        segundoFim = 10 * 60 + 30; // 10:30
      } else {
        // Horários para outros dias
        primeiroInicio = 17 * 60 + 45; // 17:45
        primeiroFim = 18 * 60 + 30; // 18:30
        segundoInicio = 19 * 60 + 45; // 19:45
        segundoFim = 20 * 60 + 30; // 20:30
      }

      // Verificar se está dentro de algum dos períodos permitidos
      const dentroDoHorario =
        (tempoAtual >= primeiroInicio && tempoAtual <= primeiroFim) ||
        (tempoAtual >= segundoInicio && tempoAtual <= segundoFim);

      setDentroHorario(dentroDoHorario);
      setHoraAtual(agora);
    };

    // Verificar imediatamente ao montar o componente
    verificarHorario();

    // Configurar o intervalo para verificar a cada segundo
    const intervalo = setInterval(verificarHorario, 1000);

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalo);
  }, []);

  // Formatação da hora atual para exibição
  const horaFormatada = horaAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Determinar texto de horários permitidos de acordo com o dia da semana
  const horarioPermitidoTexto = isSabado
    ? "7:30-8:30 e 9:45-10:30"
    : "17:45-18:30 e 19:45-20:30";

  return (
    <View
      style={[
        styles.container,
        dentroHorario ? styles.containerAberto : styles.containerFechado,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          dentroHorario ? styles.textoAberto : styles.textoFechado,
        ]}
      >
        {dentroHorario
          ? "ABERTO: Alteração de presença permitida"
          : "FECHADO: Fora do horário de alteração de presença"}
      </Text>
      <Text style={styles.infoText}>
        Horários permitidos: {horarioPermitidoTexto} | Agora: {horaFormatada}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  containerAberto: {
    backgroundColor: "#d1fae5", // Verde claro
  },
  containerFechado: {
    backgroundColor: "#fee2e2", // Vermelho claro
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textoAberto: {
    color: "#047857", // Verde escuro
  },
  textoFechado: {
    color: "#b91c1c", // Vermelho escuro
  },
  infoText: {
    fontSize: 12,
    marginTop: 5,
    color: "#6b7280", // Cinza
    textAlign: "center",
  },
});

export default PresencaStatusComponent;

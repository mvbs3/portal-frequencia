import axios from "axios";

export async function checarPresenca(
  nome: string,
  planilhaId: string
): Promise<string> {
  const url = `https://script.google.com/macros/s/AKfycbz8bneL4ymagh47f1skesT4JGxmqZ_QfbYhY-zdTnb5XvplphifGabfSkbw_eeGrBud/exec/exec?nome=${encodeURIComponent(
    nome
  )}&planilhaId=${encodeURIComponent(planilhaId)}`;
  try {
    const res = await axios.get(url);
    console.log(res.data); // Imprime a resposta
    return res.data;
  } catch (error) {
    console.error("Erro ao acessar planilha:", error);
    return "Erro ao acessar planilha.";
  }
}

// Nova função para registrar falta em massa
export default async function registrarFaltaEmMassa(
  planilhaId: string
): Promise<string> {
  const url = `https://script.google.com/macros/s/AKfycbz8bneL4ymagh47f1skesT4JGxmqZ_QfbYhY-zdTnb5XvplphifGabfSkbw_eeGrBud/exec/exec?planilhaId=${encodeURIComponent(
    planilhaId
  )}&acao=falta`;
  try {
    const res = await axios.get(url);
    console.log(res.data); // Imprime a resposta
    return res.data;
  } catch (error) {
    console.error("Erro ao registrar falta em massa:", error);
    throw new Error("Erro ao registrar falta em massa.");
  }
}

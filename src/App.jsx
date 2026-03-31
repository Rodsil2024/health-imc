async function calcularIMC() {
  if (!peso || !altura) {
    alert("Preencha peso e altura");
    return;
  }

  const pesoNum = parseFloat(peso);
  const alturaNum = parseFloat(altura);

  const imc = pesoNum / (alturaNum * alturaNum);

  let classificacao = "";

  if (imc < 18.5) classificacao = "Abaixo do peso";
  else if (imc < 25) classificacao = "Peso ideal";
  else if (imc < 30) classificacao = "Sobrepeso";
  else classificacao = "Obesidade";

  const pesoIdeal = 22 * (alturaNum * alturaNum);
  const diferenca = (pesoNum - pesoIdeal).toFixed(2);

  let cor = "";

  if (imc < 18.5) cor = "#2196F3";
  else if (imc < 25) cor = "#4CAF50";
  else if (imc < 30) cor = "#FFC107";
  else cor = "#F44336";

  const novoRegistro = {
    imc: imc.toFixed(2),
    data: new Date().toLocaleString()
  };

  const novoHistorico = [novoRegistro, ...historico];

  setHistorico(novoHistorico);
  localStorage.setItem("historicoIMC", JSON.stringify(novoHistorico));

  setResultado({
    imc: imc.toFixed(2),
    classificacao,
    pesoIdeal: pesoIdeal.toFixed(2),
    diferenca,
    cor
  });

  try {
    setRecomendacao("Gerando recomendação... ⏳");

    const response = await fetch(
      "https://health-imc-backend.onrender.com/recomendacao",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imc,
          classificacao
        })
      }
    );

    if (!response.ok) {
      throw new Error("Erro na resposta da API");
    }

    const data = await response.json();

    setRecomendacao(
      data.recomendacao || "Não foi possível gerar recomendação."
    );

  } catch (error) {
    console.error(error);

    setRecomendacao(
      "Serviço de IA indisponível no momento. Tente novamente mais tarde."
    );
  }
}
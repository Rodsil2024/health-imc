import { useState, useEffect } from "react";

function App() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [recomendacao, setRecomendacao] = useState("");

  // carregar histórico ao abrir
  useEffect(() => {
    const dados = localStorage.getItem("historicoIMC");
    if (dados) {
      setHistorico(JSON.parse(dados));
    }
  }, []);

  async function calcularIMC() {
    const imc = peso / (altura * altura);

    let classificacao = "";

    if (imc < 18.5) classificacao = "Abaixo do peso";
    else if (imc < 25) classificacao = "Peso ideal";
    else if (imc < 30) classificacao = "Sobrepeso";
    else classificacao = "Obesidade";

    const pesoIdeal = 22 * (altura * altura);
    const diferenca = (peso - pesoIdeal).toFixed(2);

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

    // 🔥 chamada para backend
try {
  setRecomendacao("Gerando recomendação... ⏳");

  const response = await fetch("https://health-imc-backend.onrender.com/recomendacao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imc,
      classificacao
    })
  });

  const data = await response.json();

  setRecomendacao(data.recomendacao);

} catch (error) {
  console.error(error);
  setRecomendacao("Erro ao buscar recomendação 😢");
}


  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f5f5f5"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "300px",
        textAlign: "center"
      }}>

        <h1 style={{ 
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333"
        }}>
          Health IMC Pro
        </h1>

        <input
          placeholder="Peso (kg)"
          onChange={(e) => setPeso(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Altura (m)"
          onChange={(e) => setAltura(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          onClick={calcularIMC}
          style={{
            width: "100%",
            padding: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Calcular
        </button>

        {resultado && (
          <div style={{ marginTop: "20px" }}>
            <h2 style={{ color: resultado.cor }}>
              IMC: {resultado.imc}
            </h2>

            <h3 style={{ color: resultado.cor }}>
              {resultado.classificacao}
            </h3>

            <p>🎯 Peso ideal: {resultado.pesoIdeal} kg</p>
            <p>📉 Diferença: {resultado.diferenca} kg</p>
            <p>🤖 {recomendacao}</p>
          </div>
        )}

        {historico.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <h4>📊 Histórico</h4>
            {historico.map((item, index) => (
              <p key={index}>
                IMC: {item.imc} ({item.data})
              </p>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;

// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // Se o usuário já estiver logado, redireciona para o perfil
  if (localStorage.getItem("authToken")) {
    window.location.href = "perfil.html";
    return;
  }

  const form = document.getElementById("form-email");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const botao = document.getElementById("btn-avancar");
    const loader = document.getElementById("loader");

    botao.disabled = true;
    botao.textContent = "Verificando...";
    loader.style.display = "block";

    try {
      const resultado = await verificarEmail(email);
      const url = resultado.existe ? "login.html" : "cadastro.html";
      window.location.href = `${url}?email=${encodeURIComponent(email)}`;
    } catch (error) {
      console.error("Ocorreu um erro:", error);
      alert("Não foi possível verificar o e-mail. Tente novamente.");
      botao.disabled = false;
      botao.textContent = "Avançar";
      loader.style.display = "none";
    }
  });
});

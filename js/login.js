// js/login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");
  const emailInput = document.getElementById("email");

  // Pega o e-mail da URL e preenche o campo
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");
  if (email) {
    emailInput.value = email;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value;
    const emailValue = emailInput.value;

    const botao = form.querySelector('button[type="submit"]');
    const loader = document.getElementById("loader");
    botao.disabled = true;
    botao.textContent = "Entrando...";
    loader.style.display = "block";

    try {
      const resultado = await autenticarUsuario(emailValue, senha);
      if (resultado.success) {
        // O token já foi salvo pela função da API
        window.location.href = "perfil.html";
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      alert(error.message || "Ocorreu um erro. Tente novamente.");
      botao.disabled = false;
      botao.textContent = "Entrar";
      loader.style.display = "none";
    }
  });
});

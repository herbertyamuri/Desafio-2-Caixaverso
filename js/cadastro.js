// js/cadastro.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const emailInput = document.getElementById("email");
  const nomeInput = document.getElementById("nome");
  const telefoneInput = document.getElementById("telefone");
  const cpfInput = document.getElementById("cpf");
  const senhaInput = document.getElementById("senha");

  // Pega o e-mail da URL e preenche o campo
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");
  if (email) {
    emailInput.value = email;
  }

  // --- MÁSCARAS DE INPUT ---
  telefoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Coloca hífen entre o quinto e o sexto dígitos
    e.target.value = value.slice(0, 15); // Limita o tamanho
  });

  cpfInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = value.slice(0, 14);
  });

  // --- VALIDAÇÕES ---
  function validarNome() {
    if (nomeInput.value.trim().length < 3) {
      alert("O nome deve ter pelo menos 3 caracteres.");
      return false;
    }
    return true;
  }

  function validarSenha() {
    const senha = senhaInput.value;
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(senha)) {
      alert(
        "A senha deve ter no mínimo 8 caracteres, com pelo menos uma letra maiúscula e um número."
      );
      return false;
    }
    return true;
  }

  function validarCPF() {
    const cpf = cpfInput.value.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      alert("CPF inválido.");
      return false;
    }
    // Lógica de validação de CPF (dígitos verificadores)
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
      alert("CPF inválido.");
      return false;
    }
    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
      alert("CPF inválido.");
      return false;
    }
    return true;
  }

  // --- SUBMISSÃO DO FORMULÁRIO ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Executa todas as validações
    if (!validarNome() || !validarCPF() || !validarSenha()) {
      return; // Interrompe se alguma validação falhar
    }

    const dadosUsuario = {
      email: emailInput.value,
      nome: nomeInput.value,
      telefone: telefoneInput.value.replace(/\D/g, ""), // Salva apenas os números
      endereco: document.getElementById("endereco").value,
      cpf: cpfInput.value,
      senha: senhaInput.value,
    };

    const botao = form.querySelector('button[type="submit"]');
    const loader = document.getElementById("loader");
    botao.disabled = true;
    botao.textContent = "Cadastrando...";
    loader.style.display = "block";

    try {
      await cadastrarUsuario(dadosUsuario);
      alert(
        "Cadastro realizado com sucesso! Você será redirecionado para a página de login."
      );
      window.location.href = `login.html?email=${encodeURIComponent(
        dadosUsuario.email
      )}`;
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert(error.message || "Ocorreu um erro durante o cadastro. Tente novamente.");
      botao.disabled = false;
      botao.textContent = "Cadastrar";
      loader.style.display = "none";
    }
  });
});

// js/perfil.js

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const perfilContainer = document.getElementById("perfil-container");

  // Oculta o container principal e mostra o loader
  perfilContainer.style.display = "none";
  loader.style.display = "block";

  try {
    // A função getPerfil já busca o token e faz a chamada autenticada
    const usuario = await getPerfil();

    // Preenche os dados na tela
    document.getElementById("nome-usuario").textContent = usuario.nome;
    document.getElementById("dados-nome").textContent = usuario.nome;
    document.getElementById("dados-email").textContent = usuario.email;
    document.getElementById("dados-telefone").textContent =
      usuario.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    document.getElementById("dados-endereco").textContent = usuario.endereco;
    document.getElementById("dados-cpf").textContent = usuario.cpf;

    // Mostra o container do perfil e esconde o loader
    perfilContainer.style.display = "block";

  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    alert(error.message || "Sessão expirada. Por favor, faça login novamente.");
    // A função logout já é chamada dentro da API em caso de token inválido,
    // mas podemos garantir que o usuário seja redirecionado.
    logout();
  } finally {
    // Garante que o loader seja escondido no final
    loader.style.display = "none";
  }

  // A função logout() agora vem do api.js e já está no escopo global
  document.getElementById("btn-logout").addEventListener("click", logout);

  // O botão de editar ainda não tem funcionalidade implementada
  document.getElementById("btn-editar").addEventListener("click", () => {
    alert("A funcionalidade de edição ainda não foi implementada.");
  });
});

// A função de logout local não é mais necessária, pois usamos a global do api.js
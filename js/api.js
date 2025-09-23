const API_URL = "http://localhost:3000/api";

// Função para verificar a existência de um e-mail
async function verificarEmail(email) {
  const response = await fetch(`${API_URL}/users/validate-email?email=${email}`);
  if (response.status === 204) {
    return { existe: false }; // E-mail não existe, pode cadastrar
  }
  if (response.status === 409) {
    return { existe: true }; // E-mail já existe, deve fazer login
  }
  // Outros erros
  const data = await response.json();
  throw new Error(data.error || "Erro ao verificar e-mail.");
}

// Função para cadastrar um novo usuário
async function cadastrarUsuario(dadosUsuario) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosUsuario),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao cadastrar usuário.");
  }
  return data;
}

// Função para autenticar (login)
async function autenticarUsuario(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "E-mail ou senha incorretos.");
  }
  // Salva o token no localStorage
  if (data.token) {
    localStorage.setItem("authToken", data.token);
    return { success: true };
  }
  return { success: false };
}

// Função para buscar os dados do perfil do usuário logado
async function getPerfil() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    // Se o token for inválido, o servidor retorna 401 ou 403
    if (response.status === 401 || response.status === 403) {
      logout(); // Faz o logout se o token for inválido
    }
    throw new Error(data.error || "Não foi possível carregar os dados do perfil.");
  }
  return data;
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "index.html";
}
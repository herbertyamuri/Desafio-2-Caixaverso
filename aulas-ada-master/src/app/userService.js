const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(USERS_FILE);
  } catch (err) {
    await fs.writeFile(USERS_FILE, JSON.stringify([] , null, 2), 'utf-8');
  }
}

async function readUsers() {
  await ensureDataFile();
  const raw = await fs.readFile(USERS_FILE, 'utf-8');
  try {
    const data = JSON.parse(raw || '[]');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    // reinicia o array se estiver com problemas
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
}

async function writeUsers(users) {
  await ensureDataFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function validateRequiredFields(payload) {
  const required = ['nome', 'telefone', 'endereco', 'email', 'cpf', 'senha'];
  const missing = required.filter((f) => !payload || payload[f] === undefined || payload[f] === null || String(payload[f]).trim() === '');
  if (missing.length) {
    const err = new Error(`Campos obrigatórios faltando: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }
}

async function createUser(payload) {
  validateRequiredFields(payload);
  const users = await readUsers();
  const emailExists = users.some((u) => u.email.toLowerCase() === String(payload.email).toLowerCase());
  if (emailExists) {
    const err = new Error('Email já cadastrado');
    err.status = 409;
    throw err;
  }
  const cpfExists = users.some((u) => u.cpf === String(payload.cpf));
  if (cpfExists) {
    const err = new Error('CPF já cadastrado');
    err.status = 409;
    throw err;
  }

  const user = {
    id: uuidv4(),
    nome: String(payload.nome).trim(),
    telefone: String(payload.telefone).trim(),
    endereco: String(payload.endereco).trim(),
    email: String(payload.email).trim(),
    cpf: String(payload.cpf).trim(),
    senha: String(payload.senha),
  };
  users.push(user);
  await writeUsers(users);
  const { senha, ...safe } = user;
  return safe;
}

async function getUserById(id) {
  const users = await readUsers();
  return users.find((u) => u.id === id) || null;
}

async function getUserByEmail(email) {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}

async function updateUser(id, updates) {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    const err = new Error('Usuário não encontrado');
    err.status = 404;
    throw err;
  }

  if (updates.email && users.some((u, i) => i !== idx && u.email.toLowerCase() === String(updates.email).toLowerCase())) {
    const err = new Error('Email já cadastrado');
    err.status = 409;
    throw err;
  }
  if (updates.cpf && users.some((u, i) => i !== idx && u.cpf === String(updates.cpf))) {
    const err = new Error('CPF já cadastrado');
    err.status = 409;
    throw err;
  }

  const current = users[idx];
  const allowed = ['nome', 'telefone', 'endereco', 'email', 'cpf', 'senha'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key) && updates[key] !== undefined) {
      current[key] = String(updates[key]);
    }
  }
  current.updatedAt = new Date().toISOString();

  users[idx] = current;
  await writeUsers(users);
  const { senha, ...userPasswordless } = current;
  return userPasswordless;
}

async function deleteUser(id) {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    const err = new Error('Usuário não encontrado');
    err.status = 404;
    throw err;
  }
  const [removed] = users.splice(idx, 1);
  await writeUsers(users);
  const { senha, ...userPasswordless } = removed;
  return userPasswordless;
}

async function authenticate(email, senha) {
  const user = await getUserByEmail(email);
  if (!user || user.senha !== String(senha)) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }
  return user;
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  authenticate,
  getUserByEmail,
};

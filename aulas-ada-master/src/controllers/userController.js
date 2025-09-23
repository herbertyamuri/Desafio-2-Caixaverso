const express = require('express');
const router = express.Router();
const service = require('../app/userService');
const { authMiddleware, signToken } = require('../middleware/auth');


// Criação de usuário
router.post('/users', async (req, res) => {
  try {
    const created = await service.createUser(req.body);
    return res.status(201).json(created);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Erro ao criar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body || {};
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    const user = await service.authenticate(email, senha);
    const token = signToken({ email: user.email, id: user.id });
    return res.json({ token });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Erro no login' });
  }
});

// Obter dados do próprio usuário logado
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const user = await service.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const { senha, ...safe } = user;
    return res.json(safe);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Erro ao buscar usuário' });
  }
});

// Buscar usuário por email
router.get('/users/validate-email', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await service.getUserByEmail(email);
    if (user) return res.status(409).json({ error: 'Usuário já existe' });
    return res.status(204).send();
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Erro ao buscar usuário' });
  }
});

// Atualizar usuário (somente o próprio)
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    const updated = await service.updateUser(id, req.body || {});
    return res.json(updated);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário (somente o próprio)
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    const removed = await service.deleteUser(id);
    return res.json(removed);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Erro ao deletar usuário' });
  }
});

module.exports = router;

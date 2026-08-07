import User from '../models/user.model.js';
import { Op } from 'sequelize';

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'El campo "name" es obligatorio y debe ser un texto válido.' });
    }
    if (name.length > 100) {
      return res.status(400).json({ message: 'El nombre no puede exceder los 100 caracteres.' });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ message: 'El campo "email" es obligatorio.' });
    }
    if (email.length > 100) {
      return res.status(400).json({ message: 'El email no puede exceder los 100 caracteres.' });
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ message: 'El campo "password" es obligatorio.' });
    }
    if (password.length > 100) {
      return res.status(400).json({ message: 'La contraseña no puede exceder los 100 caracteres.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya se encuentra registrado.' });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: password.trim()
    });

    return res.status(201).json({
      message: 'Usuario creado exitosamente.',
      data: newUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    return res.status(200).json({ message: 'Usuarios obtenidos exitosamente.', data: users });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

    if (!user) {
      return res.status(404).json({ message: `No se encontró ningún usuario con el ID ${id}.` });
    }

    return res.status(200).json({ message: 'Usuario encontrado.', data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: `No existe el usuario con ID ${id} para actualizar.` });
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '' || name.length > 100) {
        return res.status(400).json({ message: 'El nombre debe ser una cadena válida de máximo 100 caracteres.' });
      }
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || email.trim() === '' || email.length > 100) {
        return res.status(400).json({ message: 'El email debe ser una cadena válida de máximo 100 caracteres.' });
      }

      const existingEmail = await User.findOne({
        where: { email: email.trim(), id: { [Op.ne]: id } }
      });
      if (existingEmail) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
      }
      user.email = email.trim();
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.trim() === '' || password.length > 100) {
        return res.status(400).json({ message: 'La contraseña debe ser una cadena válida de máximo 100 caracteres.' });
      }
      user.password = password.trim();
    }

    await user.save();

    return res.status(200).json({
      message: 'Usuario actualizado con éxito.',
      data: user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: `No se encontró el usuario con ID ${id} para eliminar.` });
    }

    await user.destroy();
    return res.status(200).json({ message: `Usuario con ID ${id} eliminado correctamente.` });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
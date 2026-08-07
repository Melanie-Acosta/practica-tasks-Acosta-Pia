import User from '../models/User.js';
import { Op } from 'sequelize';

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos (name, email, password) son obligatorios.' });
    }
    if (name.length > 100 || email.length > 100 || password.length > 100) {
      return res.status(400).json({ message: 'Los campos no deben superar los 100 caracteres.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya se encuentra registrado.' });
    }

    const newUser = await User.create({ name, email, password });
    return res.status(201).json({ message: 'Usuario creado exitosamente.', data: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el usuario.', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los usuarios.', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el usuario.', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (name && name.length > 100) return res.status(400).json({ message: 'El nombre no puede superar los 100 caracteres.' });
    if (password && password.length > 100) return res.status(400).json({ message: 'La contraseña no puede superar los 100 caracteres.' });

    if (email) {
      if (email.length > 100) return res.status(400).json({ message: 'El email no puede superar los 100 caracteres.' });
      
      const emailExists = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id }
        }
      });
      if (emailExists) {
        return res.status(400).json({ message: 'El email ya está en uso por otro usuario.' });
      }
    }

    await user.update({ name, email, password });
    return res.status(200).json({ message: 'Usuario actualizado con éxito.', data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el usuario.', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await user.destroy();
    return res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el usuario.', error: error.message });
  }
};
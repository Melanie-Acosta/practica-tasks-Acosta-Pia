import Task from '../models/Task.js';
import { Op } from 'sequelize';

export const createTask = async (req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'El título y la descripción son obligatorios.' });
    }
    if (title.length > 100 || description.length > 100) {
      return res.status(400).json({ message: 'Los campos no deben superar los 100 caracteres.' });
    }
    if (isComplete !== undefined && typeof isComplete !== 'boolean') {
      return res.status(400).json({ message: 'El campo isComplete debe ser de tipo booleano.' });
    }

    const existingTask = await Task.findOne({ where: { title } });
    if (existingTask) {
      return res.status(400).json({ message: 'Ya existe una tarea con este título.' });
    }

    const newTask = await Task.create({ title, description, isComplete });
    return res.status(201).json({ message: 'Tarea creada con éxito.', data: newTask });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la tarea.', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.status(200).json({ data: tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las tareas.', error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la tarea.', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    if (description && description.length > 100) {
      return res.status(400).json({ message: 'La descripción no puede superar los 100 caracteres.' });
    }
    if (isComplete !== undefined && typeof isComplete !== 'boolean') {
      return res.status(400).json({ message: 'El campo isComplete debe ser booleano.' });
    }

    if (title) {
      if (title.length > 100) {
        return res.status(400).json({ message: 'El título no puede superar los 100 caracteres.' });
      }
      const titleExists = await Task.findOne({
        where: {
          title,
          id: { [Op.ne]: id }
        }
      });
      if (titleExists) {
        return res.status(400).json({ message: 'Ya existe otra tarea con este título.' });
      }
    }

    await task.update({ title, description, isComplete });
    return res.status(200).json({ message: 'Tarea actualizada exitosamente.', data: task });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la tarea.', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    await task.destroy();
    return res.status(200).json({ message: 'Tarea eliminada exitosamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar la tarea.', error: error.message });
  }
};
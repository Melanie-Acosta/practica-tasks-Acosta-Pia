import Task from '../models/task.model.js';
import { Op } from 'sequelize';

export const createTask = async (req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'El título es obligatorio y debe ser una cadena de texto.' });
    }
    if (title.length > 100) {
      return res.status(400).json({ message: 'El título no puede superar los 100 caracteres.' });
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ message: 'La descripción es obligatoria y debe ser una cadena de texto.' });
    }
    if (description.length > 100) {
      return res.status(400).json({ message: 'La descripción no puede superar los 100 caracteres.' });
    }

    if (isComplete !== undefined && typeof isComplete !== 'boolean') {
      return res.status(400).json({ message: 'El campo isComplete debe ser de tipo booleano (true o false).' });
    }

    const existingTask = await Task.findOne({ where: { title: title.trim() } });
    if (existingTask) {
      return res.status(400).json({ message: 'Ya existe una tarea registrada con ese mismo título.' });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description.trim(),
      isComplete: isComplete ?? false
    });

    return res.status(201).json({
      message: 'Tarea creada exitosamente.',
      data: newTask
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.status(200).json({ message: 'Tareas obtenidas exitosamente.', data: tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: `No se encontró la tarea con ID ${id}.` });
    }

    return res.status(200).json({ message: 'Tarea encontrada.', data: task });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: `No existe la tarea con ID ${id} para actualizar.` });
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '' || title.length > 100) {
        return res.status(400).json({ message: 'El título debe ser un texto válido de máximo 100 caracteres.' });
      }

      const existingTitle = await Task.findOne({
        where: { title: title.trim(), id: { [Op.ne]: id } }
      });
      if (existingTitle) {
        return res.status(400).json({ message: 'Ya existe otra tarea registrada con ese título.' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim() === '' || description.length > 100) {
        return res.status(400).json({ message: 'La descripción debe ser un texto válido de máximo 100 caracteres.' });
      }
      task.description = description.trim();
    }

    if (isComplete !== undefined) {
      if (typeof isComplete !== 'boolean') {
        return res.status(400).json({ message: 'El campo isComplete debe ser un valor booleano (true/false).' });
      }
      task.isComplete = isComplete;
    }

    await task.save();

    return res.status(200).json({
      message: 'Tarea actualizada correctamente.',
      data: task
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: `No se encontró la tarea con ID ${id} para eliminar.` });
    }

    await task.destroy();
    return res.status(200).json({ message: `Tarea con ID ${id} eliminada correctamente.` });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};
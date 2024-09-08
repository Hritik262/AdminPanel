import Project from '../models/project.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const project = await Project.create({ name, description, createdBy });
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Soft delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    project.deletedAt = new Date();
    await project.save();
    res.status(200).json({ message: 'Project deleted successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Restore a soft-deleted project
export const restoreProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!project.deletedAt) {
      return res.status(400).json({ message: 'Project is not deleted' });
    }
    project.deletedAt = null;
    await project.save();
    res.status(200).json({ message: 'Project restored successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export other functions if any
export const permanentDeleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, { paranoid: false });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    await project.destroy({ force: true }); // Permanently delete
    res.status(200).json({
      success: true,
      message: 'Project permanently deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete project',
      error: error.message,
    });
  }
};

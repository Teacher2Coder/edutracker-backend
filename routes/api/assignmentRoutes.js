const router = require('express').Router();

const { Assignment } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.findAll();
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

router.post('/', async (req, res) => {
  const { assignmentName, assignmentDescription, assignDate, dueDate } = req.body;
  try {
    const newAssignment = await Assignment.create({ assignmentName, assignmentDescription, assignDate, dueDate });
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { assignmentName, assignmentDescription, assignDate, dueDate } = req.body;
  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'assignment not found' });
    }
    await assignment.update({ assignmentName, assignmentDescription, assignDate, dueDate });
    res.json(assignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'assignment not found' });
    }
    await assignment.destroy();
    res.status(204).json({ message: 'assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

module.exports = router;
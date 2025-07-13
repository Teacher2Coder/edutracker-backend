const router = require('express').Router();

const { Class } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const sections = await Class.findAll();
    res.json(sections);
  } catch (error) {
    console.error('Error fetching classs:', error);
    res.status(500).json({ error: 'Failed to fetch classs' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const section = await Class.findByPk(id);
    if (!section) {
      return res.status(404).json({ error: 'class not found' });
    }
    res.json(section);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

router.post('/', async (req, res) => {
  const { className } = req.body;
  try {
    const newSection = await Class.create({ className });
    res.status(201).json(newSection);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { className } = req.body;
  try {
    const section = await Class.findByPk(id);
    if (!section) {
      return res.status(404).json({ error: 'Class not found' });
    }
    await section.update({ className });
    res.json(section);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const section = await Class.findByPk(id);
    if (!section) {
      return res.status(404).json({ error: 'class not found' });
    }
    await section.destroy();
    res.status(204).json({ message: 'class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

module.exports = router;
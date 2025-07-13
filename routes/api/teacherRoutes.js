const router = require('express').Router();

const { Teacher } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

router.post('/', async (req, res) => {
  const { teacherName, teacherEmail, teacherPassword } = req.body;
  try {
    const newTeacher = await Teacher.create({ teacherName, teacherEmail, teacherPassword });
    res.status(201).json(newTeacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { teacherName, teacherEmail, teacherPassword } = req.body;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    await teacher.update({ teacherName, teacherEmail, teacherPassword });
    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    await teacher.destroy();
    res.status(204).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

module.exports = router;
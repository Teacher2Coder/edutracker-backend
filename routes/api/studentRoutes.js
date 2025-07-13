const router = require('express').Router();

const { Student } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

router.post('/', async (req, res) => {
  const { studentName, studentEmail, studentPassword } = req.body;
  try {
    const newStudent = await Student.create({ studentName, studentEmail, studentPassword });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { studentName, studentEmail, studentPassword } = req.body;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    await student.update({ studentName, studentEmail, studentPassword });
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'student not found' });
    }
    await student.destroy();
    res.status(204).json({ message: 'student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
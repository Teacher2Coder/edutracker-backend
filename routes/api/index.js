const router = require('express').Router();

const teacherRoutes = require('./teacherRoutes');
const studentRoutes = require('./studentRoutes');
const classRoutes = require('./classRoutes');
const assignmentRoutes = require('./assignmentRoutes');

router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/assignments', assignmentRoutes);

module.exports = router;
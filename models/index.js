import { sequelize } from '../config/connection.js';

// Import all models
import Teacher from './Teacher.js';
import TeacherNotification from './TeacherNotification.js';
import Student from './Student.js';
import StudentNotification from './StudentNotification.js';
import Assignment from './Assignment.js';
import Class from './Class.js';
import Enrollment from './Enrollment.js';
import Submission from './Submission.js';

// Teacher and Class association
Teacher.hasMany(Class, { 
  foreignKey: 'teacherId',
  as: 'taughtClasses',
  onDelete: 'SET NULL',
});
Class.belongsTo(Teacher, { 
  foreignKey: 'teacherId',
  as: 'teacher',
});

//Teacher and Notification association
Teacher.hasMany(TeacherNotification, {
  foreignKey: 'teacherId',
  as: 'notifications',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
TeacherNotification.belongsTo(Teacher, {
  foreignKey: 'teacherId',
  as: 'teacher'
});

// Class and Student association
Class.belongsToMany(Student, {
  through: 'enrollment',
  foreignKey: 'classId',
  otherKey: 'studentId',
  as: 'students',
});
Student.belongsToMany(Class, {
  through: 'enrollment',
  foreignKey: 'studentId',
  otherKey: 'classId',
  as: 'classes',
});

// Class and Assignment association
Class.hasMany(Assignment, {
  foreignKey: 'classId',
  as: 'assignments',
  onDelete: 'CASCADE',
});
Assignment.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class',
});

// Assignment and Student association
Student.belongsToMany(Assignment, {
  through: 'submission',
  foreignKey: 'studentId',
  otherKey: 'assignmentId',
  as: 'assignments',
});
Assignment.belongsToMany(Student, {
  through: 'submission',
  foreignKey: 'assignmentId',
  otherKey: 'studentId',
  as: 'students',
});

// Student and notification association
Student.hasMany(StudentNotification, {
  foreignKey: 'studentId',
  as: 'notifications',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
StudentNotification.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

await sequelize.sync();

// Export all models
export {
  Teacher,
  Student,
  Assignment,
  Class,
  Enrollment,
  Submission,
  TeacherNotification,
  StudentNotification
};

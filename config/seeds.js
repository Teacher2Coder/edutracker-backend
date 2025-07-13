// Import Models
import { Teacher, Student, Assignment, Class } from '../models/index.js';
import { sequelize } from './connection.js';

// Helper functions
const generateRandomName = () => {
  const firstNames = ["Alice", "Bob", "Charlie", "David", "Emily", "Fiona", "George", "Hannah", "Ivy", "Jack", "Kevin", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tina"];
  const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark"];

  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${randomFirstName} ${randomLastName}`;
}

const generateRandomEmail = (name) => {
  const domains = ["example.com", "test.com", "demo.com", "sample.com"];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${name.toLowerCase().replace(/\s+/g, '.')}${randomNumber}@${randomDomain}`;
}

const generateRandomClassName = () => {
  const classNames = ["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Biology", "Chemistry"];
  return classNames[Math.floor(Math.random() * classNames.length)];
}

const generateRandomAssignmentName = () => {
  const assignmentNames = ["Homework", "Project", "Quiz", "Test", "Assignment", "Lab Report", "Essay", "Presentation", "Case Study", "Research Paper"];
  return assignmentNames[Math.floor(Math.random() * assignmentNames.length)];
}


// Create a array of Teachers for seeding
const createTeachers = async () => {
  const teachers = [];
  for (let i = 0; i < 10; i++) {
    const teacherName = generateRandomName();
    const teacherEmail = generateRandomEmail(teacherName);
    const teacherPassword = 'password123';
    const teacherBio = `This is a bio for ${teacherName}.`;

    const teacher = {
      teacherName,
      teacherEmail,
      teacherPassword,
      teacherBio
    }

    teachers.push(teacher);
  }
  return teachers;
}

// Create an array of Students for seeding
const createStudents = async () => {
  const students = [];
  for (let i = 0; i < 10; i++) {
    const studentName = generateRandomName();
    const studentEmail = generateRandomEmail(studentName);
    const studentPassword = 'password123';
    const studentBio = `This is a bio for ${studentName}.`;

    const student = {
      studentName,
      studentEmail,
      studentPassword,
      studentBio
    }

    students.push(student);
  }
  return students;
}

// Create an array of Classes for seeding
const createClasses = async (teachers) => {
  const classes = [];
  for (let i = 0; i < teachers.length; i++) {
    const randomClassName = generateRandomClassName();
    const teacherName = teachers[i].teacherName;

    const generatedClassName = `${teacherName}'s ${randomClassName} class`;
    const generatedClass = {
      className: generatedClassName,
      teacherId: i + 1,
    }
    classes.push(generatedClass);
  }
  return classes;
}

// Create an array of Assignments for seeding
const createAssignments = async () => {
  const assignments = [];
  for (let i = 0; i < 20; i++) {
    const randomAssignmentName = generateRandomAssignmentName();

    const generatedAssignment = {
      assignmentName: randomAssignmentName,
      assignmentDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      assignDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
    }
    assignments.push(generatedAssignment);
  }
  return assignments;
}

// Seed all teachers
const seedTeachers = async (teachers) => {
  for (let i = 0; i < teachers.length; i++) {
    const teacher = teachers[i];
    try {
      await Teacher.create(teacher);
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  }
}

// Seed all students
const seedStudents = async (students) => {
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    try {
      await Student.create(student);
    } catch (error) {
      console.error("Error creating student:", error);
    }
  }
}

// Seed all classes
const seedClasses = async (classes) => {
  const students = await Student.findAll();

  for (let i = 0; i < classes.length; i++) {
    const classData = classes[i];
    try {
      const classObj = await Class.create(classData);
      const randomStudentCount = Math.floor(Math.random() * students.length) + 1;
      const randomStudents = students.sort(() => 0.5 - Math.random()).slice(0, randomStudentCount);
      for (let j = 0; j < randomStudents.length; j++) {
        const student = randomStudents[j];
        await classObj.addStudent(student);
      }
    } catch (error) {
      console.error("Error creating class:", error);
    }
  }
}

// Seed all assignments
const seedAssignments = async (assignments) => {
  for (let i = 0; i < assignments.length; i++) {
    const assignment = assignments[i];
    try {
      const createdAssignment = await Assignment.create(assignment);
      createdAssignment.setClass(Math.floor(Math.random() * 10) + 1); // Randomly assign to a class
      const students = await Student.findAll();
      const randomStudentCount = Math.floor(Math.random() * students.length) + 1;
      const randomStudents = students.sort(() => 0.5 - Math.random()).slice(0, randomStudentCount);
      for (let j = 0; j < randomStudents.length; j++) {
        const student = randomStudents[j];
        await createdAssignment.addStudent(student);
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  }
}

// Seed the database with the generated data arrays
const seedData = async () => {
  const teachers = await createTeachers();
  const students = await createStudents();
  const classes = await createClasses(teachers);
  const assignments = await createAssignments();
  try {
    await seedTeachers(teachers);
    await seedStudents(students);
    await seedClasses(classes);
    await seedAssignments(assignments);
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// Define the seed function
const handleSeedDatabase = async () => {
  const startTime = performance.now();
  try {
    await sequelize.sync({ force: true });
    await seedData();
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    console.log('----------------------------------------');
    console.log(`Process completed in ${totalTime/1000} seconds`);
    process.exit(0);
  }
};

// Export the seed function
export default handleSeedDatabase;



import { Teacher, Student, Class, Assignment, TeacherNotification, StudentNotification } from "../models/index.js";
import auth from "../utils/auth.js";

const {
  signTokenTeacher,
  signTokenStudent,
  AuthenticationError,
} = auth;

const resolvers = {
  Query: {
    getAllTeachers: async () => {
      return await Teacher.findAll({
        include: [
          {
            model: Class,
            as: "taughtClasses",
            include: [
              {
                model: Student,
                as: "students",
              },
            ],
          },
        ],
      });
    },
    getTeacher: async (_, { id }) => {
      return await Teacher.findOne({
        where: { teacherId: id },
        include: [
          {
            model: Class,
            as: "classes",
            include: [
              {
                model: Student,
                as: "students",
              },
            ],
          },
        ],
      });
    },
    getTeacherNotifications: async (_, _args, context) => {
      return await Teacher.findOne({
        where: { teacherEmail: context.user.teacherEmail },
        include: [
          {
            model: TeacherNotification,
            as: 'notifications'
          }
        ]
      })
    },
    getTeacherDashboard: async (_parent, _args, context) => {
      if (context.user.teacherEmail) {
        const teacher = await Teacher.findOne({
          where: { teacherEmail: context.user.teacherEmail },
          include: [
            {
              model: Class,
              as: "taughtClasses",
              include: [
                {
                  model: Student,
                  as: "students",
                },
              ],
            },
          ],
        });
        return teacher;
      }
    },
    getTeacherMeProfile: async (_parent, _args, context) => {
      if (context.user.teacherEmail) {
        const teacher = await Teacher.findOne({
          where: { teacherEmail: context.user.teacherEmail },
          include: [
            {
              model: Class,
              as: "taughtClasses",
              include: [
                {
                  model: Student,
                  as: "students",
                },
              ],
            },
          ],
        });
        return teacher;
      }
    },
    getAllStudents: async () => {
      return await Student.findAll({
        include: [
          {
            model: Class,
            as: "classes",
            include: [
              {
                model: Teacher,
                as: "teacher",
              },
              {
                model: Assignment,
                as: "assignments",
              }
            ],
          },
        ],
      });
    },
    getStudent: async (_, { id }) => {
      return await Student.findOne({
        where: { studentId: id },
        include: [
          {
            model: Class,
            as: "classes",
            include: [
              {
                model: Teacher,
                as: "teacher",
              },
            ],
          },
        ],
      });
    },
    getStudentNotifications: async (_, _args, context) => {
      return await Student.findOne({
        where: { studentEmail: context.user.studentEmail },
        include: [
          {
            model: StudentNotification,
            as: 'notifications'
          }
        ]
      })
    },
    getStudentDashboard: async (_parent, _args, context) => {
      if (context.user.studentEmail) {
        const student = await Student.findOne({
          where: { studentEmail: context.user.studentEmail },
          include: [
            {
              model: Class,
              as: "classes",
              include: [
                {
                  model: Teacher,
                  as: "teacher",
                },
                {
                  model: Assignment,
                  as: "assignments",
                },
              ],
            }
          ],
        });
        return student;
      }
    },
    getStudentMeProfile: async (_parent, _args, context) => {
      if (context.user.studentEmail) {
        const teacher = await Teacher.findOne({
          where: { teacherEmail: context.user.studentEmail },
          include: [
            {
              model: Class,
              as: "classes",
              include: [
                {
                  model: Teacher,
                  as: "teacher",
                }
              ],
            },
          ],
        });
        return teacher;
      }
    },
    getAllAssignments: async () => {
      return await Assignment.findAll({
        include: [
          {
            model: Class,
            as: "class",
          },
          {
            model: Student,
            as: "students",
          },
        ],
      });
    },
    getAssignment: async (_, { id }) => {
      return await Assignment.findOne({
        where: { assignmentId: id },
        include: [
          {
            model: Class,
            as: "class",
          },
          {
            model: Student,
            as: "studentsWithSubmissions",
          },
        ],
      });
    },
    getAllClasses: async () => {
      return await Class.findAll({
        include: [
          {
            model: Teacher,
            as: "teacher",
          },
          {
            model: Student,
            as: "students",
          },
          {
            model: Assignment,
            as: "assignments",
          }
        ],
      });
    },
    getClass: async (_, { id }) => {
      return await Class.findOne({
        where: { classId: id },
        include: [
          {
            model: Teacher,
            as: "teacher",
          },
          {
            model: Student,
            as: "students",
          },
          {
            model: Assignment,
            as: "assignments",
          },
        ],
      });
    },
  },

  Mutation: {
    loginTeacher: async (_, { teacherEmail, teacherPassword }) => {
      const teacher = await Teacher.findOne({ where: { teacherEmail } });

      if (!teacher) {
        throw new AuthenticationError(
          "No teacher found with this email address"
        );
      }

      const correctPw = teacher.checkPassword(teacherPassword);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password");
      }

      const token = signTokenTeacher(teacher);
      return { token, teacher };
    },
    addTeacher: async (_, { teacherName, teacherEmail, teacherPassword }) => {
      const teacher = await Teacher.create({
        teacherName,
        teacherEmail,
        teacherPassword,
      });
      const token = signTokenTeacher(teacher);
      return { token, teacher };
    },
    editTeacher: async (
      _,
      { teacherName, teacherEmail, teacherBio },
      context
    ) => {
      const teacher = await Teacher.findOne({ where: { teacherEmail: context.user.teacherEmail } });

      if (!teacher) {
        throw new AuthenticationError("No teacher found with this ID");
      }

      teacher.teacherName = teacherName;
      teacher.teacherEmail = teacherEmail;
      teacher.teacherBio = teacherBio;

      return await teacher.save();
    },
    deleteTeacher: async (_, { id }) => {
      const teacher = await Teacher.findOne({ where: { teacherId: id } });

      if (!teacher) {
        throw new AuthenticationError("No teacher found with this ID");
      }

      await teacher.destroy();
      return teacher;
    },
    loginStudent: async (_, { studentEmail, studentPassword }) => {
      const student = await Student.findOne({ where: { studentEmail } });

      if (!student) {
        throw new AuthenticationError(
          "No student found with this email address"
        );
      }

      const correctPw = student.checkPassword(studentPassword);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password");
      }

      const token = signTokenStudent(student);
      return { token, student };
    },
    addStudent: async (_, { studentName, studentEmail, studentPassword }) => {
      const student = await Student.create({
        studentName,
        studentEmail,
        studentPassword,
      });
      const token = signTokenStudent(student);
      return { token, student };
    },
    editStudent: async (
      _,
      { id, studentName, studentEmail, studentPassword }
    ) => {
      const student = await Student.findOne({ where: { studentId: id } });

      if (!student) {
        throw new AuthenticationError("No student found with this ID");
      }

      student.studentName = studentName;
      student.studentEmail = studentEmail;
      student.studentPassword = studentPassword;

      return await student.save();
    },
    deleteStudent: async (_, { id }) => {
      const student = await Student.findOne({ where: { studentId: id } });

      if (!student) {
        throw new AuthenticationError("No student found with this ID");
      }

      await student.destroy();
      return student;
    },
    addAssignment: async (
      _,
      { assignmentName, assignmentDescription, assignDate, dueDate }
    ) => {
      const newAssignment = new Assignment({
        assignmentName,
        assignmentDescription,
        assignDate,
        dueDate,
      });
      return await newAssignment.save();
    },
    editAssignment: async (
      _,
      { id, assignmentName, assignmentDescription, assignDate, dueDate }
    ) => {
      const assignment = await Assignment.findOne({
        where: { assignmentId: id },
      });

      if (!assignment) {
        throw new AuthenticationError("No assignment found with this ID");
      }

      assignment.assignmentName = assignmentName;
      assignment.assignmentDescription = assignmentDescription;
      assignment.assignDate = assignDate;
      assignment.dueDate = dueDate;

      return await assignment.save();
    },
    deleteAssignment: async (_, { id }) => {
      const assignment = await Assignment.findOne({
        where: { assignmentId: id },
      });

      if (!assignment) {
        throw new AuthenticationError("No assignment found with this ID");
      }

      await assignment.destroy();
      return assignment;
    },
    addClass: async (_, { className }) => {
      const newClass = new Class({ className });
      return await newClass.save();
    },
    editClass: async (_, { id, className }) => {
      const classObj = await Class.findOne({ where: { classId: id } });

      if (!classObj) {
        throw new AuthenticationError("No class found with this ID");
      }

      classObj.className = className;

      return await classObj.save();
    },
    deleteClass: async (_, { id }) => {
      const classObj = await Class.findOne({ where: { classId: id } });

      if (!classObj) {
        throw new AuthenticationError("No class found with this ID");
      }

      await classObj.destroy();
      return classObj;
    },
  },
};

export default resolvers;

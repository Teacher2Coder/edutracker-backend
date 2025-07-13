const typeDefs = `
  type Teacher {
    teacherId: ID!
    teacherName: String!
    teacherEmail: String!
    teacherPassword: String!
    teacherBio: String
    taughtClasses: [Class]
    notifications: [TeacherNotification]
  }
  
  type TeacherNotification {
    notificationId: ID!
    teacherId: ID!
    notificationType: String!
    subject: String!
    body: String!
    acknowledged: Boolean!
  }
  
  type Student {
    studentId: ID!
    studentName: String!
    studentEmail: String!
    studentPassword: String!
    studentBio: String
    classes: [Class]
    assignments: [Assignment]
    notifications: [StudentNotification]
  }

  type StudentNotification {
    notificationId: ID!
    studentId: ID!
    notificationType: String!
    subject: String!
    body: String!
    acknowledged: Boolean!
  }

  type Assignment {
    assignmentId: ID!
    assignmentName: String!
    assignmentDescription: String!
    assignDate: String!
    assignDateFormatted: String
    dueDate: String!
    dueDateFormatted: String
    class: Class
    studentsWithSubmissions: [Student]
  }

  type Class {
    classId: ID!
    className: String!
    teacher: Teacher
    students: [Student]
    assignments: [Assignment]
  }

  type AuthTeacher {
    token: ID!
    teacher: Teacher
  }

  type AuthStudent {
    token: ID!
    student: Student
  }

  type Query {
    getAllTeachers: [Teacher]
    getTeacher(id: ID!): Teacher
    getTeacherNotifications: Teacher
    getTeacherDashboard: Teacher
    getTeacherMeProfile: Teacher
    getAllStudents: [Student]
    getStudent(id: ID!): Student
    getStudentNotifications: Student
    getStudentDashboard: Student
    getStudentMeProfile: Student
    getAllAssignments: [Assignment]
    getAssignment(id: ID!): Assignment
    getAllClasses: [Class]
    getClass(id: ID!): Class
  }

  type Mutation {
    loginTeacher(teacherEmail: String!, teacherPassword: String!): AuthTeacher
    addTeacher(teacherName: String!, teacherEmail: String!, teacherPassword: String!): AuthTeacher
    editTeacher(teacherName: String!, teacherEmail: String!, teacherBio: String!): Teacher
    deleteTeacher(teacherId: ID!): Teacher
    loginStudent(studentEmail: String!, studentPassword: String!): AuthStudent
    addStudent(studentName: String!, studentEmail: String!, studentPassword: String!): AuthStudent
    editStudent(studentId: ID!, studentName: String!, studentEmail: String!, studentPassword: String!): Student
    deleteStudent(studentId: ID!): Student
    addAssignment(assignmentName: String!, assignmentDescription: String!, assignDate: String!, dueDate: String!): Assignment
    editAssignment(assignmentId: ID!, assignmentName: String!, assignmentDescription: String!, assignDate: String!, dueDate: String!): Assignment
    deleteAssignment(assignmentId: ID!): Assignment
    addClass(className: String!): Class
    editClass(classId: ID!, className: String!): Class
    deleteClass(classId: ID!): Class
  }
`;

export default typeDefs;
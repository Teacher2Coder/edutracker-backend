import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';
import bcrypt from 'bcrypt';

class Student extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.studentPassword);
  }
}

Student.init(
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    studentPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentBio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, 
  {
    hooks: {
      async beforeCreate(newStudentData) {
        newStudentData.studentPassword = await bcrypt.hash(
          newStudentData.studentPassword,
          10
        );
        return newStudentData;
      },
    },
    sequelize,
    modelName: 'student',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  }
);

export default Student;
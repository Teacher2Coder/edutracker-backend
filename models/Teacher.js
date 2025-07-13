import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';
import bcrypt from 'bcrypt';

class Teacher extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.teacherPassword);
  }
}

Teacher.init(
  {
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    teacherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    teacherPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherBio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, 
  {
    hooks: {
      beforeCreate: async (newTeacherData) => {
        newTeacherData.teacherPassword = await bcrypt.hash(
          newTeacherData.teacherPassword,
          10
        );
        return newTeacherData;
      }
    },
    sequelize,
    modelName: 'Teacher',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  }
);

export default Teacher;
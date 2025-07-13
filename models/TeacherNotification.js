import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';

class TeacherNotification extends Model {};

TeacherNotification.init(
  {
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    notificationType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    acknowledged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'TeacherNotification',
    timestamps: true,
    underscored: true
  }
);

export default TeacherNotification;
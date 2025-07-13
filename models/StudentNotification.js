import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';

class StudentNotification extends Model {};

StudentNotification.init(
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
      type: DataTypes.STRING
    },
    body: {
      type: DataTypes.STRING
    },
    acknowledged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'StudentNotification',
    timestamps: true,
    underscored: true
  }
);

export default StudentNotification;
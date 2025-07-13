import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';

class Submission extends Model {}

Submission.init(
  {
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'submission',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  }
);

export default Submission;
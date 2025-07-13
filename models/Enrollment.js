import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';

class Enrollment extends Model {}

Enrollment.init(
  {
    enrollmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    }
  }, 
  {
    sequelize,
    modelName: 'enrollment',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  }
)

export default Enrollment;
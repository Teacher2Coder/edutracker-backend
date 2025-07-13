import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';

class Class extends Model {}

Class.init(
  {
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, 
  {
    sequelize,
    modelName: 'class',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  }
);

export default Class;
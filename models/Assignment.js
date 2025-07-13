import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/connection.js';
import moment from 'moment';

class Assignment extends Model {}

Assignment.init(
  {
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    assignmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assignmentDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    assignDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, 
  {
    getterMethods: {
      assignDateFormatted() {
        if (this.assignDate) {
          return moment(this.assignDate).format('MM/DD/YYYY');
        }
        return null;
      },
      dueDateFormatted() {
        if (this.dueDate) {
          return moment(this.dueDate).format('MM/DD/YYYY');
        }
        return null;
      },
    },
    sequelize,
    modelName: 'Assignment',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
  }
);

export default Assignment;
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      this.hasMany(models.User_Anime, { foreignKey: 'User_ID' });
    }
  }
  User.init({
    User_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Ensure this matches your SQL table if you use AUTO_INCREMENT
    },
    Username: {
      type: DataTypes.STRING,
      unique: true
    },
    Email: {
      type: DataTypes.STRING,
      unique: true
    },
    Password: DataTypes.STRING,
    Age: DataTypes.INTEGER,
    Gender: DataTypes.STRING,
    Date_joined: DataTypes.DATE,
    Last_login: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User', // Explicitly specify the table name
    timestamps: false // Since you are not using createdAt and updatedAt fields
  });
  return User;
};

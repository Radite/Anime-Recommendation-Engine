'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Anime extends Model {
    // Define any custom methods here
  }
  User_Anime.init({
    User_Anime_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    User_ID: DataTypes.INTEGER,
    Anime_ID: DataTypes.INTEGER,
    Rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'User_Anime',
    tableName: 'User_Anime',
    timestamps: false
  });
  return User_Anime;
};

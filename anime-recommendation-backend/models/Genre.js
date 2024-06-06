// models/Genre.js

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.belongsToMany(models.Anime, {
        through: 'Anime_Genres',
        foreignKey: 'Genre_ID'
      });
    }
  }
  Genre.init({
    Genre_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    GenreName: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Genre',
    tableName: 'Genres',
    timestamps: false
  });
  return Genre;
};

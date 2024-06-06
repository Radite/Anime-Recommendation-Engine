// models/Anime.js

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Anime extends Model {
    static associate(models) {
      Anime.belongsToMany(models.Genre, {
        through: 'Anime_Genres',
        foreignKey: 'Anime_ID'
      });
      Anime.belongsToMany(models.Studio, {
        through: 'Anime_Studios',
        foreignKey: 'Anime_ID'
      });
      Anime.belongsToMany(models.Demographic, {
        through: 'Anime_Demographics',
        foreignKey: 'Anime_ID'
      });
    }
  }
  Anime.init({
    Anime_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: DataTypes.STRING,
    Score: DataTypes.FLOAT,
    Aired: DataTypes.INTEGER,
    Duration: DataTypes.INTEGER,
    Episodes: DataTypes.INTEGER,
    Rating: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Anime',
    tableName: 'Anime',
    timestamps: false
  });
  return Anime;
};

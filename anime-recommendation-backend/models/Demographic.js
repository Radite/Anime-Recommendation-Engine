// models/Demographic.js

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Demographic extends Model {
    static associate(models) {
      Demographic.belongsToMany(models.Anime, {
        through: 'Anime_Demographics',
        foreignKey: 'Demographic_ID'
      });
    }
  }
  Demographic.init({
    Demographic_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    DemographicName: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Demographic',
    tableName: 'Demographics',
    timestamps: false
  });
  return Demographic;
};

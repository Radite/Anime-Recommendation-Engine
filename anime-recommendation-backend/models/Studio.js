// models/Studio.js

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Studio extends Model {
    static associate(models) {
      Studio.belongsToMany(models.Anime, {
        through: 'Anime_Studios',
        foreignKey: 'Studio_ID'
      });
    }
  }
  Studio.init({
    Studio_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    StudioName: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Studio',
    tableName: 'Studios',
    timestamps: false
  });
  return Studio;
};

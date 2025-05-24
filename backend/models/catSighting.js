import { DataTypes } from "sequelize";

export function createModel(database) {
  database.define('CatSighting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 1000]
      }
    },
    image: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    publicationDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  });
}

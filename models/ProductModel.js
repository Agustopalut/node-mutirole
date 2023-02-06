import db from "../config/Database.js";
import { Sequelize } from "sequelize";
const { DataTypes } = Sequelize;
import Users from "./UserModel.js";

const Products = db.define(
  "product",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false, //tidak boleh kosong
      validate: {
        notEmpty: true, //tidak boleh string kosong
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, //tidak boleh kosong
      validate: {
        notEmpty: true, //tidak boleh string kosong
        len: [3, 100], //minimal 3 karakter dan maksimal 100 karakter
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false, //tidak boleh kosong
      validate: {
        notEmpty: true, //tidak boleh string kosong
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, //tidak boleh kosong
      validate: {
        notEmpty: true, //tidak boleh string kosong
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Products);
Products.belongsTo(Users, { foreignKey: "userId" }); //relasi

export default Products;

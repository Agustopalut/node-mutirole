import db from "../config/Database.js";
import { Sequelize } from "sequelize";
const { DataTypes } = Sequelize;

const Users = db.define(
  "user",
  {
    uuid: {
      type: DataTypes.STRING, //UUID bawaan dari sequelize
      defaultValue: DataTypes.UUIDV4, //uuid seperti id random string
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
    email: {
      type: DataTypes.STRING,
      allowNull: false, //tidak boleh kosong
      validate: {
        notEmpty: true, //tidak boleh string kosong
        isEmail: true, //wajib email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, //tidak boleh kosong
      validate: {
        notEmpty: true, //tidak boleh string kosong
      },
    },
    role: {
      type: DataTypes.STRING,
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

export default Users;

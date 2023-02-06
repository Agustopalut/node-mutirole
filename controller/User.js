import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["id", "uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const getUsersById = async (req, res) => {
  const { uuid } = req.params;
  try {
    const response = await Users.findOne({
      attributes: ["id", "uuid", "name", "email", "role"],
      where: {
        uuid: uuid,
      },
    });

    if (!response) return res.status(404).json({ msg: "user tidak ditemukan" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const createUsers = async (req, res) => {
  const { name, email, password, confirmpassword, role } = req.body;
  if (password === "" || password === null)
    return res.status(400).json({ msg: "isikan password dengan benar" });
  if (password !== confirmpassword)
    return res
      .status(400)
      .json({ msg: "password dan confirm password tidak cocok" });
  const hashpassword = await argon2.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashpassword,
      role: role,
    });
    res.status(201).json({ msg: "register berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

export const updateUsers = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });
  if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });
  let hashpassword;
  const { name, email, password, confirmpassword, role } = req.body;
  if (password === "" || password === null) {
    hashpassword = user.password; // jika tidak mengirim password baru,itu artinya menggunakan password lama
  } else {
    hashpassword = await argon2.hash(password);
  }
  if (password !== confirmpassword)
    return res
      .status(400)
      .json({ msg: "password dan confirm password tidak cocok" });
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashpassword,
        role: role,
      },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "user berhasil di update" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const deleteUsers = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });
  try {
    if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });
    await Users.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ msg: "user berhasil di hapus" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

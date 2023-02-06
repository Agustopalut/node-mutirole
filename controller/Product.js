import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  // variable req.role dan req.useriD berasal dari middleware Auth,yang dimana ketika kita berhasil login,variabler tersebut langsung dibuat
  try {
    let response;
    if (req.role === "admin") {
      // jika login sebagai admin,maka dia mendapatkan semua datanya
      response = await Products.findAll({
        attributes: ["uuid", "name", "price"], //attributes dari data producs nya
        include: [
          {
            model: Users, //relasi
            attributes: ["name", "email"], //attributes dari data user nya
          },
        ],
      });
    } else {
      // jika login sebagai users,maka hanya mendapatkan data yang dua inputkan saja
      //table ini sudah memiliki relas
      response = await Products.findAll({
        attributes: ["id", "uuid", "name", "price"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const response = await Products.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });

    if (!response)
      return res.status(404).json({ msg: "product tidak ditemukan" });
    let getproduct;
    if (req.role === "admin") {
      getproduct = await Products.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          id: response.id,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      getproduct = await Products.findOne({
        attributes: ["id", "uuid", "name", "price"],
        where: {
          [Op.and]: [{ id: response.id }, { userId: response.userId }], //operator and pada mysql
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProducts = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Products.create({
      name: name,
      price: price,
      userId: req.userId,
    });

    res.status(201).json({ msg: "product berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProducts = async (req, res) => {
  try {
    const response = await Products.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });

    if (!response)
      return res.status(400).json({ msg: "product tidak ditemukan " });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Products.update(
        { name, price },
        {
          where: {
            id: response.id,
          },
        }
      );
    } else {
      if (req.userId !== response.userId)
        return res.status(400).json({ msg: "akses ditolak " }); //jika user yang login ,id nya tidak terdaftar di data product
      await Products.update(
        { name, price },
        {
          where: {
            id: response.id,
          },
        }
      );
    }
    res.status(200).json({ msg: "product berhasil di update" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const response = await Products.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!response)
      return res.status(404).json({ msg: "product tidak ditemukan" });
    if (req.role === "admin") {
      await Products.destroy({
        where: {
          id: response.id,
        },
      });
    } else {
      if (req.userId !== response.userId)
        return res.status(400).json({ msg: "akses di tolak " });
      await Products.destroy({
        where: {
          [Op.and]: [{ id: response.id }, { userId: req.userId }],
        },
      });
    }

    res.status(200).json({ msg: "product berhasil di hapus " });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

import Users from "../models/UserModel.js";
import argon2 from "argon2";
// controller ini untuk login,logout dan me yang (me untuk mendapatkan data user yang login/data orang itu sendiri)
// auth ini akan tidak berjalan bagus ketika server nya direstart,maka kita harus menyimpan session nya kedalam database,agar meski server nya direstart,user yang sudah login maka tak perlu login kembali
//gunakan package yang bernama connect-session-sequelize
export const login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });
    const validasi = await argon2.verify(user.password, req.body.password);
    if (!validasi) return res.status(400).json({ msg: "password salah" });
    req.session.userId = user.uuid; //membuat session
    const uuid = user.uuid,
      name = user.name,
      email = user.email,
      role = user.role;
    res.status(200).json({ uuid, name, email, role });
  } catch (error) {
    res.status(404).json({ msg: "email tidak ditemukan" });
  }
};
export const me = async (req, res) => {
  //session itu sepert cookie
  // function ini untuk mendapatkan data user yang berhasil login/data dia sendiri
  if (!req.session.userId)
    return res.status(400).json({ msg: "anda harus login terlebih dahulu" }); //jika tidak terdapat session/belum login
  const user = await Users.findOne({
    attributes: ["id", "uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId, //mencari data user berdasarkan uuid  nya
    },
  });

  if (!user) return res.status(400).json({ msg: "user tidak ditemukan" });
  res.status(200).json(user);
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(400).json({ msg: "gagal untuk melakukan logout" });
    res.status(200).json({ msg: "anda berhasil logout" });
  });
};

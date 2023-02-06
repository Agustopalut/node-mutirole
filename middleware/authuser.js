import Users from "../models/UserModel.js";
export const verify = async (req, res, next) => {
  // verifikasi apakah sudah login atau belum
  if (!req.session.userId)
    return res.status(400).json({ msg: "anda harus login terlebih dahulu" }); //jika tidak terdapat session/belum login
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(400).json({ msg: "user tidak ditemukan" });
  req.userId = user.id; //membuat variable untuk validasi di controller product
  req.role = user.role; //ini juga sama
  next();
};

export const adminOnly = async (req, res, next) => {
  // midleware untuk membuat hanya admin yag bisa mendapatkan data"user,dan bisa melakukan apa saja
  //tak perlu pengecekan session karena sudah 100% login
  //namun harus dicek siapa yang login
  // session itu seperti cookie(hampir mirip tapi bukan cookie)
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(400).json({ msg: "user tidak ditemukan" });
  if (user.role !== "admin")
    return res.status(403).json({ msg: "akses di tolak" });
  next();
};

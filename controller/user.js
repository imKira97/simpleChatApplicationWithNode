const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.newUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    if (name === "" || email === "" || password === "" || phone === "") {
      return res.status(400).json({ message: "please enter all fields" });
    } else {
      const data = {
        name: name,
        email: email,
        phone: phone,
        password: await bcrypt.hash(password, 10),
      };
      const user = await User.create(data);
      console.log("user created" + user);
      res.status(201).json({ message: "user created", data: user });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err, message: "user already exist" });
  }
};

function generateToken(id) {
  return jwt.sign({ userId: id }, process.env.TOKEN_SECRET);
}

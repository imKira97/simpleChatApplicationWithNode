const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

exports.getUser = async (req, res, next) => {
  try {
    const loginUserName = req.user.name;
    console.log(loginUserName);
    const userList = await User.findAll({
      attributes: ["name", "id"],
      where: { id: { [Op.not]: req.user.id } },
    });

    return res.status(201).json({
      userList: userList,
      loginUser: loginUserName,
      message: "success",
    });

    //here we will show all the user in our app to loginUser
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "not able to get User" });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    const userMatch = await User.findOne({ where: { email: email } });
    console.log("user", userMatch);

    if (userMatch) {
      const isUserPassword = await bcrypt.compare(password, userMatch.password);

      if (isUserPassword) {
        console.log("login success");
        return res.status(201).json({
          message: "login success",
          token: generateToken(userMatch.id),
        });
      } else {
        console.log("password fail");
        return res.status(401).json({ message: "User not authorized  " });
      }
    } else {
      console.log("user not exist");
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: err });
  }
};

exports.newUser = async (req, res, next) => {
  try {
    //console.log(req.body);
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
      //console.log("user created" + user);
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

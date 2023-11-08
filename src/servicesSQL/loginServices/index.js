require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../../database/usersRepository");

const login = async (email, password) => {
  try {
    const user = await getUserByEmail(email);

    const passwordValidate = await bcrypt.compare(password, user.password);

    if (!passwordValidate) {
      throw new Error("Email or Password invalid");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS, {
      expiresIn: "12h",
    });
    
    const { password: _, ...userData } = user;

    return { user: userData, token };

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = login;

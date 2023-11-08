const bcrypt = require("bcrypt");
const knex = require("../../database/index")
const { saveUsers, getUserById, updateUser } = require('../../database/usersRepository')

const creatUserService = async (name, email, passwordParam) => {
  try {
    const hashPassword = await bcrypt.hash(passwordParam, 10);

    const emailExist = await knex("users").where("email", email);
    if (emailExist.length > 0) {
      throw new Error("Email already registered");
    }

    const userCreated = await saveUsers(name, email, hashPassword);

    const { password = _, ...user } = userCreated;

    return { user };
  } catch (error) {
    throw new Error(error.message);
  }
};

const editUserLogged = async (userData, id) => {
  const userToEdit = await getUserById(id);

  let { name, email, cpf } = userData;

  if (cpf) {
    const cpfExist = await knex("users")
      .where("cpf", userData.cpf)
      .returning("*");

    if (cpfExist.length > 0 && cpfExist[0].cpf !== userToEdit.cpf) {
      const badRequestError = new Error("Cpf already registered");
      badRequestError.name = "cpf";
      throw badRequestError;
    }
  }

  if (email) {
    const emailExist = await knex("users")
      .where("email", userData.email)
      .returning("*");

    if (emailExist.length > 0 && emailExist[0].email !== userToEdit.email) {
      const badRequestError = new Error("Email already registered");
      badRequestError.name = "email";
      throw badRequestError;
    }

  }

  // if (password) {
  //   password = await bcrypt.hash(password, 10);
  // }

  const user = await updateUser({ name, email, cpf }, id);

  const userUpdated = user[0];

  return userUpdated;
};

const emailVerify = async (name, email) => {
  if (!name || !email) {
    throw new Error("Name and Email required");
  }
  const userExist = await knex("users").where("email", email);

  if (userExist.length > 0) {
    return { canRegister: false, error: "User already registered" };
  }

  return { canRegister: true };
};



module.exports = { creatUserService, editUserLogged, emailVerify };

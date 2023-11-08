const knex = require("./index");

const getUserById = async (id) => {
  try {
    const user = await knex("users").where("id", id);

    if (user.length === 0) {
      throw new Error("User not found");
    }

    return user[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await knex("users");
    if (users.length === 0) {
      throw new Error("User not found");
    }

    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserByEmail = async (emailToFound) => {
  try {
    const email = await knex("users").where("email", emailToFound);

    if (email.length === 0) {
      throw new Error("Email or password invalid");
    }

    return email[0];
    
  } catch (error) {
    throw new Error(error.message);
  }
};

const saveUsers = async (name, email, password) => {
  try {
    const user = await knex("users")
      .insert({ name, email, password })
      .returning("*");

    return user[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUser = async (id) => {
  try {
    await getUserById(id);

    await knex("users").where("id", id).del();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (userData, id) => {
  try {
    await getUserById(id);

    const user = await knex("users")
      .where("id", id)
      .update(userData)
      .returning("*");

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getUserById,
  getAllUsers,
  getUserByEmail,
  saveUsers,
  deleteUser,
  updateUser,
};

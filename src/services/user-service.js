const { UserRepository } = require("../repositories");
const { RoleRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { Auth, Enum } = require("../utils/common");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
  try {
    const user = await userRepository.create(data);
    const role = await roleRepository.getRoleByName(Enum.USER_ROLES.CUSTOMER);
    await user.addRole(role);
    return user;
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    throw new AppError(
      "Unable to create User",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function signin(data) {
  try {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "No user found for current email",
        StatusCodes.NOT_FOUND
      );
    }
    const passwordMatch = Auth.checkPassword(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError("invalid password", StatusCodes.NOT_FOUND);
    }
    const jwt = Auth.createToken({ id: user.id, email: user.email });
    return jwt;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Missing jwt token", StatusCodes.BAD_REQUEST);
    }
    const response = Auth.verifyToken(token);
    const user = await userRepository.get(response.id);
    if (!user) {
      throw new AppError("No user found", StatusCodes.NOT_FOUND);
    }
    return user.id;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid jwt token", StatusCodes.BAD_REQUEST);
    }
    if (error.name == "TokenExpiredError") {
      throw new AppError("JWT token expired", StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function addRoleToUser(data) {
  try {
    const user = await userRepository.get(data.id);
    if (!user) {
      throw new AppError(
        "No user found for the given Id",
        StatusCodes.NOT_FOUND
      );
    }
    const role = await roleRepository.getRoleByName(data.role);
    if (!role) {
      throw new AppError("No role found", StatusCodes.NOT_FOUND);
    }
    await user.addRole(role);
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAdmin(id) {
  try {
    const user = await userRepository.get(id);
    if (!user) {
      throw new AppError(
        "No user found for the given Id",
        StatusCodes.NOT_FOUND
      );
    }
    const role = await roleRepository.getRoleByName(Enum.USER_ROLES.ADMIN);
    if (!role) {
      throw new AppError("No role found", StatusCodes.NOT_FOUND);
    }
    return await user.hasRole(role);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isFlightCompany(id) {
  try {
    const user = await userRepository.get(id);
    if (!user) {
      throw new AppError(
        "No user found for the given Id",
        StatusCodes.NOT_FOUND
      );
    }
    const role = await roleRepository.getRoleByName(
      Enum.USER_ROLES.FLIGHT_COMPANY
    );
    if (!role) {
      throw new AppError("No role found", StatusCodes.NOT_FOUND);
    }
    return await user.hasRole(role);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = {
  createUser,
  signin,
  isAuthenticated,
  addRoleToUser,
  isAdmin,
  isFlightCompany,
};

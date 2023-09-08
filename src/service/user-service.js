import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/userValidation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const count = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (count === 1) {
    throw new ResponseError(400, "Username Already exist");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const login = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: login.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username atau password salah");
  }
  const userCompare = await bcrypt.compare(login.password, user.password);
  if (!userCompare) {
    throw new ResponseError(401, "Username atau password salah");
  }

  const token = uuid().toString();
  return prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: login.username,
    },
    select: {
      token: true,
    },
  });
};

export default {
  register,
  login,
};

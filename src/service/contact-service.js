import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { createContactValidation } from "../validation/contactValidation.js";

const create = async (username, request) => {
  request = validate(createContactValidation, request);
  request.username = username;

  return prismaClient.contact.create({
    data: request,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

export default {
  create,
};

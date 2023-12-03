import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validation/contactValidation.js";

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

const get = async (id, username) => {
  id = validate(getContactValidation, id);

  const contact = await prismaClient.contact.findFirst({
    where: {
      id: id,
      username: username,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  return contact;
};

const update = async (request, username) => {
  request = validate(updateContactValidation, request);

  const count = await prismaClient.contact.count({
    where: {
      id: request.id,
      username: request.username,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "contact not found");
  }

  return prismaClient.contact.update({
    where: {
      id: request.id,
    },
    data: {
      first_name: request.first_name,
      last_name: request.last_name,
      email: request.email,
      phone: request.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      phone: true,
      email: true,
    },
  });
};

const remove = async (id, username) => {
  id = validate(getContactValidation, id);

  const count = await prismaClient.contact.count({
    where: {
      id: id,
      username: username,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "Contact not found");
  }

  await prismaClient.contact.delete({
    where: {
      id: id,
    },
  });
};

const search = async (request, username) => {
  request = validate(searchContactValidation, request);

  const skip = (request.page - 1) * request.size;

  const filter = [];

  filter.push({
    username: username,
  });

  if (request.name) {
    filter.push({
      OR: [
        {
          first_name: {
            contains: request.name,
          },
        },
        {
          last_name: {
            contains: request.name,
          },
        },
      ],
    });
  }

  if (request.email) {
    filter.push({
      email: {
        contains: request.email,
      },
    });
  }

  if (request.phone) {
    filter.push({
      phone: {
        contains: request.phone,
      },
    });
  }

  const contacts = await prismaClient.contact.findMany({
    where: {
      AND: filter,
    },
    take: request.size,
    skip: skip,
  });

  const total = await prismaClient.contact.count({
    where: {
      AND: filter,
    },
  });

  return {
    data: contacts,
    paging: {
      page: request.page,
      total_item: total,
      total_page: Math.ceil(total / request.size),
    },
  };
};

export default {
  create,
  get,
  update,
  remove,
  search,
};

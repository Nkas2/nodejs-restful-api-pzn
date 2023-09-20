import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  createdAddressValidation,
  getAddressValidation,
  updateAddressValidation,
} from "../validation/addressValidation";
import { getContactValidation } from "../validation/contactValidation";
import { validate } from "../validation/validation";

const checkContactMustExists = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  return contactId;
};

const create = async (user, contactId, request) => {
  contactId = await checkContactMustExists(user, contactId);

  const address = validate(createdAddressValidation, request);
  address.contact_id = contactId;
  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const get = async (user, contactId, addressId) => {
  contactId = await checkContactMustExists(user, contactId);
  addressId = validate(getAddressValidation, addressId);

  const address = await prismaClient.address.findFirst({
    where: {
      contact_id: contactId,
      id: addressId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "address is not found");
  }

  return address;
};

const update = async (user, contactId, request) => {
  contactId = await checkContactMustExists(user, contactId);
  const address = validate(updateAddressValidation, request);

  const addressInDataBase = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: address.id,
    },
  });

  if (addressInDataBase !== 1) {
    throw new ResponseError(404, "Address not found");
  }

  return prismaClient.address.update({
    where: {
      id: address.id,
    },
    data: {
      city: address.city,
      street: address.street,
      country: address.country,
      postal_code: address.postal_code,
      province: address.province,
    },
    select: {
      id: true,
      city: true,
      street: true,
      country: true,
      postal_code: true,
      province: true,
    },
  });
};

const remove = async (user, contactId, addressId) => {
  contactId = await checkContactMustExists(user, contactId);
  addressId = validate(getAddressValidation, addressId);

  const totalInDataBase = await prismaClient.address.count({
    where: {
      id: addressId,
      contact_id: contactId,
    },
  });

  if (totalInDataBase !== 1) {
    throw new ResponseError(404, "Address not found");
  }

  await prismaClient.address.delete({
    where: {
      id: addressId,
    },
  });
};

const list = async (user, contactId) => {
  contactId = await checkContactMustExists(user, contactId);

  return prismaClient.address.findMany({
    where: {
      contact_id: contactId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

export default {
  create,
  get,
  update,
  remove,
  list,
};

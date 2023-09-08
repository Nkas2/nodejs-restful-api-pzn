import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { registerUserValidation } from "../validation/userValidation.js"
import { validate } from "../validation/validation.js"
import bcrypt from 'bcrypt'

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const count = await prismaClient.user.count({
    where: {
      username: user.username
    }
  })

  if(count === 1){
    throw new ResponseError(400, 'Username Already exist')
  }

  user.password = await bcrypt.hash(user.password, 10)

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true
    }
  })
}

export default {
  register
}
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (data) => {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const findUserByEmail = async (email) => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

export const findUserById = async (id) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

export const updateUserById = async (id, data) => {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const deleteUserById = async (id) => {
  try {
    return await prisma.user.delete({ where: { id } });
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

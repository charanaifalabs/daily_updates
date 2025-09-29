import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPost = (data) => prisma.post.create({ data });
export const getAllPosts = () =>
  prisma.post.findMany({
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
export const getPostsByUser = (userId) =>
  prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });
export const getPostById = (id) => prisma.post.findUnique({ where: { id } });
export const updatePostById = (id, data) =>
  prisma.post.update({ where: { id }, data });
export const deletePostById = (id) => prisma.post.delete({ where: { id } });

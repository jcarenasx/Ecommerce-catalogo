import { prisma } from "../prisma";

export const customerRepository = {
  create(data: { name: string; phone: string }) {
    return prisma.customer.create({
      data,
    });
  },

  findAll() {
    return prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
};

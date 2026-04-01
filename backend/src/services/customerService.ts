import { customerRepository } from "../repositories/customerRepository";

export const customerService = {
  async create(input: { name: string; phone: string }) {
    return customerRepository.create(input);
  },

  list() {
    return customerRepository.findAll();
  },
};

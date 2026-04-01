import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { customerService } from "../services/customerService";

const createSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

export const customerController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Customer payload:", req.body);
      const parsed = createSchema.safeParse(req.body);
      console.log("Parsed payload:", parsed);
      if (!parsed.success) {
        return res.status(400).json({
          error: "INVALID_BODY",
          message: "El cuerpo no cumple la validación mínima.",
          details: parsed.error.format(),
        });
      }

      const customer = await customerService.create(parsed.data);
      return res.status(201).json({ customer });
    } catch (error) {
      console.error("Failed to create customer", error);
      const message =
        error instanceof Error ? error.message : "Ocurrió un error creando el cliente.";
      return res.status(500).json({
        error: "CUSTOMER_CREATION_FAILED",
        message,
      });
    }
  },
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await customerService.list();
      return res.json({ customers });
    } catch (error) {
      console.error("Failed to list customers", error);
      const message =
        error instanceof Error ? error.message : "Ocurrió un error obteniendo los clientes.";
      return res.status(500).json({
        error: "CUSTOMER_LIST_FAILED",
        message,
      });
    }
  },
};

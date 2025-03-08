import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";
import { knex } from "@/database/knex";
import z from "zod";

class ProductController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query

      const products = await knex<ProductRepository>("products").select("*").whereLike("name", `%${name ?? ''}%`).orderBy('name');
      
      return res.json({ products });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim(),
        price: z.number().gt(0),
      });

      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products").insert({ name, price });

      return res.status(201).json({ message: "Produto criado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };

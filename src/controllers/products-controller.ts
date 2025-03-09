import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";
import { knex } from "@/database/knex";
import z from "zod";

class ProductController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;

      const products = await knex<ProductRepository>("products")
        .select("*")
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name");

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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(req.params.id);

      const bodySchema = z.object({
        name: z.string().optional(),
        price: z.number().optional(),
      });

      const { name, price } = bodySchema.parse(req.body);

      if(!name && !price) {
        throw new AppError("You must provide at least one field to update", 400);
      }

      const product = await knex<ProductRepository>("products")
        .select("*")
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      await knex<ProductRepository>("products")
        .update({
          ...product,
          name: name !== undefined ? name : product.name,
          price: price !== undefined ? price : product.price,
          updated_at: new Date(),
        })
        .where({ id });

      res.json({ message: "Product updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };

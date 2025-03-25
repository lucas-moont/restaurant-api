import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import z from "zod";
import { knex } from "@/database/knex";

class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      });

      const { table_session_id, product_id, quantity } = bodySchema.parse(
        req.body
      );

      const product = await knex<ProductRepository>("products")
        .select()
        .where({ id: product_id })
        .first();
      if (!product) {
        throw new AppError("Product not found", 404);
      }

      const tableSession = await knex<TableSessionsRepository>(
        "tables_sessions"
      )
        .select()
        .where({ id: table_session_id })
        .first();

      if (!tableSession || tableSession.closed_at) {
        throw new AppError("Table session not found or closed", 404);
      }

      await knex<OrdersRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price * quantity,
      });

      res.status(201).json({ menssage: "Order created" });
    } catch (e) {
      next(e);
    }
  }
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const table_session_id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Invalid id" })
        .parse(req.params.id);

      const order = await knex('orders')
        .join('products', 'orders.product_id', 'products.id')
        .select("orders.id", "orders.table_session_id", "orders.product_id", "orders.quantity", "orders.price", 'products.name')
        .where({ table_session_id})

      res.json({order})
    } catch (e) {
      next(e);
    }
  }
}

export { OrdersController };

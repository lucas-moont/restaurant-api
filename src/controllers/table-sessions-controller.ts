import { knex } from "@/database/knex";
import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import z from "zod";

class TableSessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number(),
      });

      const { table_id } = bodySchema.parse(req.body);

      const table = await knex<TablesRepository>("tables")
        .where("id", table_id)
        .first();

      if (!table) {
        throw new AppError("Table not found", 404);
      }

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .where({ table_id })
        .orderBy("opened_at")
        .first();

        if(session && !session.closed_at) {
          throw new AppError('This table is already opened', 400)
        }

      await knex<TableSessionsRepository>("tables_sessions").insert({
        table_id,
        opened_at: knex.fn.now(),
      });

      res.status(201).json();
    } catch (error) {
      next(error);
    }
  }
}

export { TableSessionsController };

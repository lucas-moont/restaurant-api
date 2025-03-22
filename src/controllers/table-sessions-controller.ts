import { knex } from "@/database/knex";
import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import z from "zod";

class TableSessionsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await knex<TableSessionsRepository>("tables_sessions")
        .select("*")
        .orderBy("closed_at");

      if (sessions.length === 0) {
        res.json({ message: "No sessions found" });
      }

      res.json(sessions);
    } catch (e) {
      next(e);
    }
  }

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

      if (session && !session.closed_at) {
        throw new AppError("This table is already opened", 400);
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Invalid id" })
        .parse(req.params.id);

      const session = await knex<TableSessionsRepository>("tables_sessions")
        .select("*")
        .where("id", id)
        .first();

      if (!session) {
        throw new AppError("Session not found", 404);
      }

      if (session.closed_at) {
        throw new AppError("Session already closed", 400);
      }

      await knex<TableSessionsRepository>("tables_sessions")
        .where("id", id)
        .update({ id, closed_at: knex.fn.now() });

      res.json({ message: 'Session closed successfully.' });
    } catch (e) {
      next(e);
    }
  }
}

export { TableSessionsController };

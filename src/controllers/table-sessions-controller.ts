import { knex } from "@/database/knex";
import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import z from 'zod'

class TableSessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try{
      return res.json({message: 'Table session created'})
    }catch(error) {
      next(error)
    }
  }
}

export { TableSessionsController }
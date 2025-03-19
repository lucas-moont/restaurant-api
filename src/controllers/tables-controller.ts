import { Request, Response, NextFunction, response } from 'express'
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import z from 'zod'

class TablesController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const tables: TablesRepository[] = await knex('tables').select('*').orderBy('table_number')

      res.json({ tables })
    }catch(error){
      next(error)
    }
  }
}

export { TablesController }
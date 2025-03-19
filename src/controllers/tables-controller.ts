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

  async create(req: Request, res: Response, next: NextFunction) {
    try{
      const bodySchema = z.object({
        table_number: z.number().int().positive()
      })

      const { table_number } = bodySchema.parse(req.body)

      const tableExists = await knex<TablesRepository>('tables').where({ table_number }).first()

      if(tableExists){
        throw new AppError('Table already exists', 400)
      }

      await knex<TablesRepository>('tables').insert( { table_number })

      res.status(201).json({ message: `Table ${table_number} created sucessfully`})
    }catch(error){
      next(error)
    }
  }
}

export { TablesController }
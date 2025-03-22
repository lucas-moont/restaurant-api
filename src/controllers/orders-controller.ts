import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import z from "zod";
import { knex } from "@/database/knex";


class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try{
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      })

      const { table_session_id, product_id, quantity } = bodySchema.parse(req.body)
    
      const product = await knex<ProductRepository>('products').select().where({id: product_id}).first()
      if(!product){
        throw new AppError('Product not found', 404)
      }

      const tableSession = await knex<TableSessionsRepository>('tables_sessions').select().where({id: table_session_id}).first()
      
      if(!tableSession || tableSession.closed_at){
        throw new AppError('Table session not found or closed', 404)
      }

      await knex<OrdersRepository>('orders').insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price * quantity
      })

      res.status(201).json({menssage: 'Order created'})
    }catch(e){
      next(e)
    }
  }
  async index(req: Request, res: Response, next: NextFunction) {

  }
}

export { OrdersController }
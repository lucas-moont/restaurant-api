import { Router } from "express";
import { OrdersController } from "@/controllers/orders-controller";

const ordersRoutes = Router();
const orderController = new OrdersController()

ordersRoutes.post('/', orderController.create)
ordersRoutes.get('/table-session/:id/total', orderController.total)
ordersRoutes.get('/table-session/:id', orderController.index)

export { ordersRoutes }
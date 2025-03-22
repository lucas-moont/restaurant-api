import { Router } from "express";
import { TableSessionsController } from "@/controllers/table-sessions-controller"; 

const tableSessionsRoutes = Router();
const tableSessionsController = new TableSessionsController()

tableSessionsRoutes.post('/', tableSessionsController.create)
tableSessionsRoutes.get('/', tableSessionsController.index)

export { tableSessionsRoutes}
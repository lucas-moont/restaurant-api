import { Router } from "express";

import { productsRoutes } from "./products-routes";
import { tablesRoutes } from "./tables-router";
import { tableSessionsRoutes } from "./table-session-routes";

const routes = Router();

routes.use('/products', productsRoutes)
routes.use('/tables', tablesRoutes)
routes.use('/tables-sessions', tableSessionsRoutes)

export { routes }
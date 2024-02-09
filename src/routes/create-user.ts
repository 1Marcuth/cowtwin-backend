import { Router } from "express"

import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/create-user"
import schema from "../schemas/create-user"

const router = Router()

router.post("/create-user", validatorMiddleware(schema), controller)

export default router
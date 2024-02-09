import { Router } from "express"

import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/get-user"
import schema from "../schemas/get-user"

const router = Router()

router.post("/get-user", validatorMiddleware(schema), controller)

export default router
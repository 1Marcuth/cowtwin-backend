import { Router } from "express"

import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/login-user"
import schema from "../schemas/login-user"

const router = Router()

router.post("/login-user", validatorMiddleware(schema), controller)

export default router
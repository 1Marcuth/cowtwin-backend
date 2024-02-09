import { Router } from "express"

import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/create-message"
import schema from "../schemas/create-message"

const router = Router()

router.post("/create-message", validatorMiddleware(schema), controller)

export default router
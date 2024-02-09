import { Router } from "express"

import authenticationMiddleware from "../middlewares/auth-user"
import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/get-user"
import schema from "../schemas/get-user"

const router = Router()

router.post(
    "/get-user",
    authenticationMiddleware(true),
    validatorMiddleware(schema),
    controller
)

export default router
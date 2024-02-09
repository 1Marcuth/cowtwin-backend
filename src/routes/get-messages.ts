import { Router } from "express"

import authenticationMiddleware from "../middlewares/auth-user"
import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/get-messages"
import schema from "../schemas/get-messages"

const router = Router()

router.post(
    "/get-messages",
    authenticationMiddleware(true),
    validatorMiddleware(schema),
    controller
)

export default router
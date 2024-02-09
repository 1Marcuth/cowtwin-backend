import { Router } from "express"

import authenticationMiddleware from "../middlewares/auth-user"
import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/create-message"
import schema from "../schemas/create-message"

const router = Router()

router.post(
    "/create-message",
    authenticationMiddleware(true),
    validatorMiddleware(schema),
    controller
)

export default router
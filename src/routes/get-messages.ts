import { Router } from "express"

import authenticationMiddleware from "../middlewares/authentication"
import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/get-messages"
import schema from "../schemas/get-messages"

const router = Router()

router.get(
    "/get-messages",
    authenticationMiddleware(true),
    validatorMiddleware(schema),
    controller
)

export default router
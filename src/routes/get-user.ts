import { Router } from "express"

import authenticationMiddleware from "../middlewares/authentication"
import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/get-user"
import schema from "../schemas/get-user"

const router = Router()

router.get(
    "/get-user",
    authenticationMiddleware(true),
    validatorMiddleware(schema),
    controller
)

export default router
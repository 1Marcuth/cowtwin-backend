import { Router } from "express"

import authenticationMiddleware from "../middlewares/authentication"
import validatorMiddleware from "../middlewares/validator"
import controller from "../controllers/create-user"
import schema from "../schemas/create-user"

const router = Router()

router.post(
    "/create-user",
    authenticationMiddleware(false),
    validatorMiddleware(schema),
    controller
)

export default router
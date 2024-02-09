import { Router } from "express"

import controller from "../controllers/login-user"

const router = Router()

router.post("/login-user", controller)

export default router
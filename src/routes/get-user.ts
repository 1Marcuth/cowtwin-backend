import { Router } from "express"

import controller from "../controllers/get-user"

const router = Router()

router.post("/get-user", controller)

export default router
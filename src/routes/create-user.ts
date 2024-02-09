import { Router } from "express"

import controller from "../controllers/create-user"

const router = Router()

router.post("/create-user", controller)

export default router
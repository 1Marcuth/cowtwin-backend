import { Router } from "express"

import controller from "../controllers/create-message"

const router = Router()

router.post("/create-message", controller)

export default router
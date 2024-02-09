import { Router } from "express"

import controller from "../controllers/get-messages"

const router = Router()

router.post("/get-messages", controller)

export default router
import { ZodSchema ,ZodError } from "zod"
import { Middleware } from "../types"

const validatorMiddleware = (schema: ZodSchema): Middleware => (req, res, next) => {
    try {
        schema.parse(req.body)
        return next()
    } catch (error) {
        if (error instanceof ZodError) {
            const fieldErrors = error.errors.map((error) => {
                return {
                    field: error.path.join("."),
                    message: error.message
                }
            })

            return res.status(400).json({ error: "Invalid request body", fieldErrors })
        } else {
            return res.status(400).json({ error: "Invalid request body" })
        }
    }
}

export default validatorMiddleware
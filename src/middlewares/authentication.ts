import DatabaseService from "../services/database-service"
import { Middleware } from "../types"

async function checkSessionValidity(id: string) {
    const databaseService = new DatabaseService()
    const session = await databaseService.getSession(id)

    if (session) {
        const currentTime = Date.now()

        if (currentTime < session.expiresAt) {
            return {
                isValid: true,
                userId: session.userId
            }
        }
    }

    return {
        isValid: false
    }
}

const authenticationMiddleware = (neededAuth: boolean): Middleware => async (req, res, next) => {
    if (neededAuth) {
        const sessionId = req.body.sessionId

        if (!sessionId) {
            return res.status(401).json({ message: "You need to be authenticated to access this resource." })
        }

        const result = await checkSessionValidity(sessionId)

        if (!result.isValid) {
            return res.status(401).json({ message: "Your session is invalid, please log in again!" })
        }

        req.body.authorId = result.userId
    } else if (!neededAuth && req.cookies.sessionId) {
        return res.status(403).json({ message: "You are now authenticated!" })
    }

    return next()
}

export default authenticationMiddleware
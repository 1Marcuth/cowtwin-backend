import { Middleware } from "../types"

const authenticationMiddleware = (neededAuth: boolean): Middleware => async (req, res, next) => {
    if (!req.cookies.sessionId && neededAuth) {
        return res.status(401).json({ message: "You need to be authenticated to access this resource." })
    }

    if (!neededAuth && req.cookies.sessionId) {
        return res.status(403).json({ message: "You are now authenticated!" })
    }

    return next()
}

export default authenticationMiddleware
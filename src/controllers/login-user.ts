import DatabaseService from "../services/database-service"
import { Controller, LoginUserOptions } from "../types"

const controller: Controller = async (req, res) => {
    const data = req.body as LoginUserOptions
    
    try {
        const databaseService = new DatabaseService()
        const result = await databaseService.loginUser(data)
        
        if (result.isValidLogin && result.userId) {
            const session = await databaseService.createSession(result.userId)
            return res.status(200).send({ ...result, sessionId: session.id })
        }

        return res.status(404).send({
            message: "Not found user!",
            isValidLogin: false
        })
    } catch(error: any) {
        console.error(`> [Internal Server Error] ${error}`)

        return res.status(500).send({
            message: "Internal server error",
            isValidLogin: false
        })
    }
}

export default controller
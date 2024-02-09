import DatabaseService from "../services/database-service"
import { Controller, LoginUserOptions } from "../types"

const controller: Controller = async (req, res) => {
    const data = req.body as LoginUserOptions
    const databaseService = new DatabaseService()

    try {
        const result = await databaseService.loginUser(data)
        
        if (result.isValidLogin && result.userId) {
            res.cookie("sessionId", result.userId, { httpOnly: true })
            return res.status(200).send(result)
        }

        return res.status(404).send({
            message: "Not found user!",
            isValidLogin: false
        })
    } catch(error: any) {
        return res.status(500).send({
            message: "Internal server error",
            isValidLogin: false
        })
    }
}

export default controller
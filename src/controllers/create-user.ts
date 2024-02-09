import DatabaseService from "../services/database-service"
import { Controller, CreateUserOptions } from "../types"

const controller: Controller = async (req, res) => {
    const data = req.body as CreateUserOptions

    try {
        const databaseService = new DatabaseService()
        const result = databaseService.createUser(data)
        return res.status(201).send(result)
    } catch(error) {
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

export default controller
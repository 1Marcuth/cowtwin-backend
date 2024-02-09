import { Controller, CreateMessageOptions } from "../types"
import DatabaseService from "../services/database-service"

const controller: Controller = (req, res) => {
    const data = req.body as CreateMessageOptions

    try {
        const databaseService = new DatabaseService()
        const result = databaseService.createMessage(data)
        return res.status(201).send(result)
    } catch(error) {
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

export default controller
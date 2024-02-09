import DatabaseService from "../services/database-service"
import { Controller, GetUserOptions } from "../types"

const controller: Controller = async (req, res) => {
    const data = req.body as GetUserOptions

    try {
        const databaseService = new DatabaseService()
        const result = await databaseService.getUser(data)

        if (result) {
            return res.status(200).send(result)
        }

        return res.status(404).send({
            message: "User not found"
        })
    } catch(error) {
        console.error(`> [Internal Server Error] ${error}`)

        return res.status(500).send({
            message: "Internal server error"
        })
    }
}

export default controller
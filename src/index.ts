import dotenv from "dotenv"

import Server from "./server"

dotenv.config()

;(async () => {
    const port = process.env.PORT
    const server = new Server({ port: port ? Number(port) : undefined })

    await server.start()
})();
import { fileURLToPath } from "url"
import express from "express"
import path from "path"
import fs from "fs"

async function handleRoutes(app: express.Application) {
    const routesDir = path.join(__dirname, "..", "routes")

    await fs.promises.readdir(routesDir)
        .then(fileNames => {
            fileNames.forEach(async (fileName) => {
                const routeFile = path.join(routesDir, fileName)
                const route = (await import(routeFile)).default
                return app.use(route)
            })
        })
}

export default handleRoutes
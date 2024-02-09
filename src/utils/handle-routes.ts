import { fileURLToPath } from "url"
import express from "express"
import path from "path"
import fs from "fs"

const dirname = path.dirname(fileURLToPath(import.meta.url))

async function handleRoutes(app: express.Application) {
    const routesDir = path.join(dirname, "..", "routes")

    await fs.promises.readdir(routesDir)
        .then(fileNames => {
            fileNames.forEach(async (fileName) => {
                const routeFile = path.join(routesDir, fileName)
                const route = await import(routeFile)
                console.log(route)
                return app.use(route)
            })
        })
}

export default handleRoutes
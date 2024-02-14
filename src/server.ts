import cookieParser from "cookie-parser"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import http from "http"
import path from "path"
import fs from "fs"

import handleRoutes from "./utils/handle-routes"

export type ServerOptions = {
    port?: number
}

const defaultServerOptions = {
    port: undefined
}

class Server {
    private app: express.Application
    private port: number
    private server?: http.Server

    public constructor({ port }: ServerOptions = defaultServerOptions) {
        this.port = port || 3000
        this.app = express()
        this.useMiddlewares()
        this.useRoutes()
        this.useLogger()
    }

    private useMiddlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.use(cors({ origin: "*" }))
    }

    private useRoutes() {
        handleRoutes(this.app)
    }

    private useLogger() {
        this.app.use(morgan("dev"))
    }

    public loadRoutesAndControllers() {
        const routesDir = path.join(__dirname, "routes")
        const controllersDir = path.join(__dirname, "controllers")

        fs.readdirSync(routesDir).forEach((file) => {
            const routePath = path.join(routesDir, file)
            const routeModule = require(routePath)

            if (typeof routeModule === "function") {
                routeModule(this.app)
            }
        })

        fs.readdirSync(controllersDir).forEach((file) => {
            const controllerPath = path.join(controllersDir, file)
            const controllerModule = require(controllerPath)

            if (typeof controllerModule === "function") {
                controllerModule(this.app)
            }
        })
    }

    public start() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, () => {
                console.log(`> [app] The server is listening on: http://localhost:${this.port}/`)
                return resolve(null)
            })

            this.server.on("error", reject)
        })
    }

    public stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close((error) => {
                    if (error) return reject(error)
                    console.log("> [app] The server has been closed successfully!")
                    return resolve(null)
                })
            }

            console.log("> [app] The server has been closed successfully!")

            return resolve(null)
        })
    }
}

export default Server
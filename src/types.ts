import { Request, Response, NextFunction } from "express"

import createMessageSchema from "./schemas/create-message"
import createUserSchema from "./schemas/create-user"
import getMessagesSchema from "./schemas/get-messages"
import getUserSchema from "./schemas/get-user"
import loginUserSchema from "./schemas/login-user"

export type Controller = (request: Request, response: Response, next: NextFunction) => any
export type Middleware = (request: Request, response: Response, next: NextFunction) => any

export type CreateMessageOptions = typeof createMessageSchema["_output"]
export type CreateUserOptions = typeof createUserSchema["_output"]
export type GetMessagesOptions = typeof getMessagesSchema["_output"]
export type GetUserOptions = typeof getUserSchema["_output"]
export type LoginUserOptions = typeof loginUserSchema["_output"]

export type GetUserResult = CreateUserOptions & { id: string }

export type CreateUserResult = Omit<CreateUserOptions & {
    id: string
    writeResult: FirebaseFirestore.WriteResult
}, "password">

export type CreateMessageResult = CreateMessageOptions & {
    id: string
    writeResult: FirebaseFirestore.WriteResult
}

export type LoginUserResult = {
    userId?: string
    isValidLogin: boolean
}

export type Message = CreateMessageOptions & {
    id: string
}
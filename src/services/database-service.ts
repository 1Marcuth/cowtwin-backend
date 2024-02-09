import admin from "firebase-admin"
import crypto from "node:crypto"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { z } from "zod"

import createMessageSchema from "../schemas/create-message"
import createUserSchema from "../schemas/create-user"
import getMessagesSchema from "../schemas/get-messages"
import getUserSchema from "../schemas/get-user"
import loginUserSchema from "../schemas/login-user"
import validateCall from "../utils/validate-call"

import type {
    CreateUserOptions,
    CreateMessageOptions,
    GetMessagesOptions,
    GetUserOptions,
    LoginUserOptions,
    CreateUserResult,
    GetUserResult,
    CreateMessageResult,
    LoginUserResult,
    Message
} from "../types"

dotenv.config()

const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS as string)
const saltRounds = Number(process.env.SALT_ROUNDS)

const app = admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

class DatabaseService {
    private app: admin.app.App
    private firestore: admin.firestore.Firestore

    public constructor() {
        this.app = app
        this.firestore = this.app.firestore()
    }

    @validateCall(z.array(z.string()))
    private async isValidUserId(id: string): Promise<boolean> {
        const usersCollection = this.firestore.collection("users")
        const userDocument = usersCollection.doc(id)
        const userSnapshot = await userDocument.get()
        return userSnapshot.exists
    }

    @validateCall(z.array(z.string()))
    private async isValidMessageId(id: string): Promise<boolean> {
        const messagesCollection = this.firestore.collection("messages")
        const messageDocument = messagesCollection.doc(id)
        const messageSnapshot = await messageDocument.get()
        return messageSnapshot.exists
    }

    @validateCall(z.array(z.array(z.string())))
    private async getMessagesByIds(ids: string[]): Promise<Message[]> {
        const messages: Message[] = []

        const messagesSnapshot = await this.firestore
            .collection("messages")
            .where(admin.firestore.FieldPath.documentId(), "in", ids)
            .get()

        messagesSnapshot.forEach(doc => {
            const messageData = {
                id: doc.id,
                ...doc.data()
            } as Message

            messages.push(messageData)
        })

        return messages
    }

    @validateCall(z.array(z.number()))
    private async getLastMessages(count: number): Promise<Message[]> {
        const messagesCollection = this.firestore.collection("messages")
    
        const querySnapshot = await messagesCollection
            .orderBy("createdAt", "desc")
            .limit(count)
            .get()
    
        const messages: Message[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Message))
    
        return messages
    }
    
    @validateCall(z.array(z.number()))
    private async getTopMessages(count: number): Promise<Message[]> {
        const messagesCollection = this.firestore.collection("messages")
        const querySnapshot = await messagesCollection
            .orderBy("createdAt", "asc")
            .limit(count)
            .get()

        const messages: Message[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Message))
    
        return messages
    }

    @validateCall(z.array(createUserSchema))
    public async createUser({ password, createdAt }: CreateUserOptions): Promise<CreateUserResult> {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const usersCollection = this.firestore.collection("users")
        const userId = crypto.randomUUID()
        const userDocument = usersCollection.doc(userId)
        const currentTime = Date.now()

        if (createdAt > currentTime) {
            createdAt = currentTime
        }

        const writeResult = await userDocument.set({
            createdAt: createdAt,
            password: hashedPassword
        })

        const result = {
            id: userId,
            createdAt: createdAt,
            writeResult: {
                writeTime: writeResult.writeTime
            }
        }

        return result
    }

    @validateCall(z.array(loginUserSchema))
    public async loginUser({ password }: LoginUserOptions): Promise<LoginUserResult> {
        const usersCollection = this.firestore.collection("users")

        try {
            const userQuerySnapshot = await usersCollection.get()

            for (const userDoc of userQuerySnapshot.docs) {
                const userData = userDoc.data() as CreateUserOptions
                const hashedPassword = userData.password
                const passwordMatch = await bcrypt.compare(password, hashedPassword)

                if (passwordMatch) {
                    return {
                        userId: userDoc.id,
                        isValidLogin: true
                    }
                }
            }

            return { isValidLogin: false }
        } catch (error) {
            return { isValidLogin: false }
        }
    }

    @validateCall(z.array(getUserSchema))
    public async getUser({ id }: GetUserOptions): Promise<GetUserResult | null> {
        const usersCollection = this.firestore.collection("users")

        const userDocument = usersCollection.doc(id)
        const userSnapshot = await userDocument.get()

        if (!userSnapshot.exists) {
            return null
        }

        const userData = {
            id: id,
            ...userSnapshot.data()
        } as GetUserResult

        return {
            id: userData.id,
            createdAt: userData.createdAt
        }
    }

    @validateCall(z.array(createMessageSchema))
    public async createMessage({ authorId, parentId, createdAt, content }: CreateMessageOptions): Promise<CreateMessageResult> {
        const messagesCollection = this.firestore.collection("messages")
        const messageId = crypto.randomUUID()
        const messageDocument = messagesCollection.doc(messageId)

        const isValidAuthorId = await this.isValidUserId(authorId)
        const currentTime = Date.now()

        if (createdAt > currentTime) {
            createdAt = currentTime
        }

        if (parentId) {
            const isValidMessageId = await this.isValidMessageId(parentId)

            if (!isValidMessageId) {
                throw new Error(`Invalid message id ${parentId}`)
            }
        } else {
            parentId = undefined
        }

        if (!isValidAuthorId) {
            throw new Error(`Invalid author id: ${authorId}`)
        }

        const writeResult = await messageDocument.set({
            authorId: authorId,
            parentId: parentId,
            createdAt: createdAt,
            content: content
        })

        const result: CreateMessageResult = {
            id: messageId,
            authorId: authorId,
            parentId: parentId,
            createdAt: createdAt,
            content: content,
            writeResult: {
                writeTime: writeResult.writeTime
            }
        }

        return result
    }

    @validateCall(z.array(getMessagesSchema))
    public async getMessages({ count, ids, mode }: GetMessagesOptions) {
        if (!ids || ids.length === 0) {
            if (!mode) {
                throw new Error("You must provide at least one message ID or specify the mode and count.")
            } else if (!count) {
                throw new Error("You must provide the message count when specifying the mode.")
            }
        } else if (!mode) {
            mode = "last"
        }

        let messages: Message[] = []
        
        if (ids) {
            messages = await this.getMessagesByIds(ids)
        } else if (count && mode) {
            if (mode === "last") {
                messages = await this.getLastMessages(count)
            } else if (mode === "first") {
                messages = await this.getTopMessages(count)
            } else {
                throw new Error(`Invalid mode specified: ${mode}`)
            }
        }

        return messages
    }
}

export default DatabaseService
import { z } from "zod"

import { chatSettings } from "../settings"

const schema = z.object({
    authorId: z.string().uuid(),
    parentId: z.string().uuid().optional(),
    createdAt: z.number(),
    content: z.string().min(chatSettings.message.charsRange[0]).max(chatSettings.message.charsRange[1])
})

export default schema
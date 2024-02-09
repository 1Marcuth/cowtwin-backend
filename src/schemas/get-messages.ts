import { z } from "zod"

import { chatSettings } from "../settings"

const schema = z.object({
    ids: z.array(z.string().uuid()).optional(),
    mode: z.enum(["first", "last"]).optional(),
    count: z.number().int().min(chatSettings.message.minCount).max(chatSettings.message.maxCount).optional()
})

export default schema
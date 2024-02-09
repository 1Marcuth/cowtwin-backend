import { z } from "zod"

import { chatSettings } from "../settings"

const schema = z.object({
    password: z.string().min(chatSettings.user.passwordRange[0]).max(chatSettings.user.passwordRange[1])
})

export default schema
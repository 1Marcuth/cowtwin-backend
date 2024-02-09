import { ZodType, ZodError } from "zod"

function validateCall<T extends any[], U>(
    schema: ZodType<U, any>,
    errorHandler?: (error: ZodError) => void
) {
    return function (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value

        descriptor.value = function (...args: T) {
            try {
                const validatedArgs = schema.parse(args)
                return originalMethod.apply(this, validatedArgs)
            } catch(error: any) {
                if (errorHandler) {
                   errorHandler(error)
                } else {
                    throw error
                }
            }
        }

        return descriptor
    }
}

export default validateCall
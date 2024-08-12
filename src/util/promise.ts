/** Attempts to resolve `promise`.  */
export const attempt = <T, E = Error>(
    promise: Promise<T>,
): Promise<[T, null] | [undefined, E]> =>
    promise
        .then<[T, null]>((data: T) => [data, null])
        .catch<[undefined, E]>((err: E) => [undefined, err])

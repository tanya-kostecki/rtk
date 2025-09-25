/**
 * Type predicate to narrow an unknown error to an object with a string property
 */
export function isErrorWithProperty<T extends string>(
  error: unknown,
  property: T
): error is Record<T, string> | undefined {
  return (
    typeof error === 'object' &&
    error != null &&
    property in error &&
    typeof (error as Record<string, unknown>)[property] === 'string'
  )
}

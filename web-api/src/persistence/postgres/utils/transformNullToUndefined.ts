// In Postgres, values that are null were typically undefined in DynamoDb.
// This function goes through and recursively sets null values from the DB
// to undefined in application code.
export function transformNullToUndefined<T>(
  value: T,
): ReplaceNullWithUndefined<T> {
  if (value === null) {
    return undefined as ReplaceNullWithUndefined<T>;
  }

  if (Array.isArray(value)) {
    return value.map(item =>
      transformNullToUndefined(item),
    ) as ReplaceNullWithUndefined<T>;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        transformNullToUndefined(val),
      ]),
    ) as ReplaceNullWithUndefined<T>;
  }

  return value as ReplaceNullWithUndefined<T>;
}

export type ReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? ReplaceNullWithUndefined<U>[]
    : T extends object
      ? { [K in keyof T]: ReplaceNullWithUndefined<T[K]> }
      : T;

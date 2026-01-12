// Pick fields, but make them nullable
// Useful in cases where we left join table X with Y: we want the fields from Y,
// but with a left join they might all be null (if nothing in Y matches with X)
export type NullablePick<T, K extends string> = {
  [P in Extract<keyof T, K>]: T extends Record<P, infer V> ? V | null : never;
};

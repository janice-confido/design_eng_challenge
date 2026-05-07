/** Shallow equality check */
export const isObjectEqual = <T extends object>(a: T, b: T): boolean => {
  const keysA = Object.keys(a) as (keyof T)[]
  if (keysA.length !== Object.keys(b).length) return false
  return keysA.every((k) => a[k] === b[k])
}

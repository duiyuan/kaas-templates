/**
 * create plain object without prototype
 */
export function plainObject(obj: KeyValue<any>) {
  return Object.assign(Object.create(null), obj)
}

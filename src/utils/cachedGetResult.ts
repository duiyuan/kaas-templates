export default function cachedGetResult(
  target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originGetter: any = descriptor.get
  descriptor.get = (function () {
    let value: any
    return function () {
      if (value === undefined) {
        value = originGetter.call(target)
      }
      return value
    }
  })()
}

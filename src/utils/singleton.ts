type ReturnSingleton<T, K = any> = (arg?: K) => T
type ISingleton<T, K> = new (arg?: any) => T

export default function makeSingleon<T, K>(
  Singleton: ISingleton<T, K>
): ReturnSingleton<T, K> {
  let once: T | null = null
  return (args?: K) => {
    if (!once) {
      once = new Singleton(args)
    }
    return once
  }
}

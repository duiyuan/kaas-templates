declare module '*.scss'

type ValueOf<T> = T[keyof T]

interface Window {
  contentProxy: any
}

interface StyleComponent<T = string> {
  className?: T
  style?: React.CSSProperties
}

interface KeyValue<T = any> {
  [props: string]: T
}

type ValueOf<T> = T[keyof T]

interface CommonResponse<T> {
  Status: number
  Message: string
  Result: T
}

interface LitenodeResponse<T> {
  code: number
  message: string
  data: T
}

type Override = CommonResponse<{
  Address: string
  Height: number
  NextISN: number
  Height: number
}>

interface DynamodbResponse<T> {
  Content: T
  Hash: string
}

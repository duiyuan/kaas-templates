// https://eips.ethereum.org/EIPS/eip-1193#provider-errors
// https://eth.wiki/json-rpc/json-rpc-error-codes-improvement-proposal

// 4900 is intended to indicate that the Provider is disconnected from all chains
// while 4901 is intended to indicate that the Provider is disconnected from a specific chain only
// In other words, 4901 implies that the Provider is connected to other chains, just not the requested one.

import { plainObject } from '../utils/object'

export enum StandardCode {
  UserReject = 4001,
  Unauthorized = 4100,
  Unsupported_Method = 4200,
  Unsupported_Event = 4300,
  Absent_method_handler = 4400,
  Parse_Error = 32700,
  Operation_Timeout = 32605,
}

const StandardMessage: KeyValue<string> = {
  4001: 'User Reject',
  4100: 'unauthorized',
  4200: 'unsupported method',
  4300: 'unsupported event',
  4400: 'absent method handler',
  32700: 'parse error',
  32605: 'operation timeout',
}

export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export default function makeError(
  code: StandardCode | number,
  data: any,
  message?: string,
  params?: any
) {
  return plainObject({
    message: message || StandardMessage[code],
    code,
    data,
    params,
  })
}

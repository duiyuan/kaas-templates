declare namespace DioxScanService {
  interface CommonResponse<T> {
    Status: number
    Message: string
    Result?: T
  }

  interface MasterBlockResponse {
    TotalNum: number
    ListData: DIOX.MasterBlockSummary[]
  }

  interface DynamodbResponse<T> {
    Content: T
    Hash: string
  }
}

/* Overview */
declare namespace DIOX {
  interface Overview {
    PrimaryKey: number
    BlockInterval: number
    ForkRate: number
    TotalBlocks: number
    Difficulty: number
    AvgGasPrice: number
    NumShards: number
    ShardOrder: number
    Throughput: number
    TotalTxn: number
    TotalStateSize: number
    MempoolSize: number
    AddressCount: number
    Height: number
  }
}

/* Shard */
declare namespace DIOX {
  interface ShardSummary {
    ShardIndex: number
    Throughput: number
    TotalTxn: number
    TotalStateSize: number
    MempoolSize: number
    AddressCount: number
    Height: number
  }
}

/* Tx */
declare namespace DIOX {
  interface TxSummary {
    Height: number
    ShardIndex: number
    ExecIndex: number
    RelayGroupIndex: number
    ShardOrder: number
    BlockTime: number
    TxnHash: string
    TxnType: string
    Initiator: string
    Target: string
    OriginalTxnHash: string
    Invocation: any
    TxnTime: number
    Func: string
  }
  interface TxDetail {
    BlockTime: number
    Height: number
    Initiator: string
    Address: string
    BuildNum: number
    ConfirmedBy: string
    ConfirmState?: string
    ExecStage: string
    Function: string
    GasOffered: number
    GasPrice: string
    Grouped: false
    Hash: string
    Packing?: string // 是否打包交易
    Relays?: Array<TxDetail> // 交易打包列表
    Input: {
      [key: string]: string | number
    }
    Invocation: {
      [key: string]: string | number
    }
    Mode: string
    OrigExecIdx: number
    OrigTxHash: string
    Shard: number[]
    Size: number
    Signers?: string[]
    Timestamp: number
    ISN?: number
  }
}

/* Block */
declare namespace DIOX {
  interface MasterBlockSummary {
    Height: number
    ShardIndex: number
    Timestamp: number
    NumScheduledTxns: number
    NumIntraRelayTxns: number
    NumInboundRelayTxns: number
    NumOutboundTxns: number
    NumDeferredTxns: number
    NumUserInitiatedTxns: number
    MinerAddress: string
    Reward: string
    Hash: string
  }

  interface ShardBlockResponse {
    TotalNum: number
    ListData: ShardBlockSummary[]
  }

  interface ShardBlockSummary {
    Height: number
    ShardIndex: number
    Timestamp: number
    NumScheduledTxns: number
    NumIntraRelayTxns: number
    NumInboundRelayTxns: number
    NumOutboundTxns: number
    NumDeferredTxns: number
    NumUserInitiatedTxns: number
    MinerAddress: string
    GasFee: string
    Hash: string
  }
  interface BlockDetail {
    Size: number
    Scope: string
    Throughput: number
    Shard: [number, number]
    Prev: string
    BlockInterval: number
    Consensus: number
    TxnCount: [number, number, number, number, number, number]
    ExecutionCount: number
    MasterBlock: string
    BlockMerkleLeaf: string
    ConfirmedTxnHash: string
    ConfirmedTxnMerkle: string
    ProcessedTxnMerkle: string
    ChainStateMerkle: string
    GlobalChainStateMerkle: string
    GlobalProcessedTxnMerkle: string
    GlobalTxnBlockMerkleLeaf: string
    ShardOutboundRelayMerkle: string
    ShardProcessedTxnMerkle: string
    ShardTxnBlockMerkle: string
    TotalGasFee: string
    AvgGasPrice: string
    Hash: string
    Height: number
    Timestamp: number
    Miner: string
    Stage: string
    State: string
    PowDifficulty: number
    PowNonce: string
    ScalingNext: boolean
    Uncles: string[]
    Transactions: {
      Scheduled: string[]
      Confirmed: string[]
      DispatchRelays: string[]
      Deferred: string[]
    }
  }
}

declare namespace DIOX {
  interface MetaData {
    Description?: string
    IconUrl?: string
    Name?: string
    Website?: string
    Social?: {
      Github: string
      Discord: string
      Twitter: string
      Telegram: string
      Facebook: string
      Email: string
    }
  }
  interface BaseAddress {
    Metadata: MetaData
    FirstSeen: number | string
    LastSeen: number | string
    TotalTxn: number
    TotalIssuedTxn: number
    TotalContract: number
    Address: string
    Balance: number
    CoinAge: number // 100000000 / (1024 * 1024)，单位是DIO * sec，然后再除以 86400是day，再除以12是year
    Wallet: { [key: string]: number | string } // wallt key 的数量 代表token held
    Vault: Array<[number, number]> // vault 数组一维下标 代表NFT held
  }

  interface TokenAddress extends BaseAddress {
    Symbol: string
    Delegator: string
    TotalSupply: string
    ID: number
    Flags: number // 右移22位取低6位 代表Decimals
  }
  interface TokenResponse {
    TotalNum: number
    ListData: TokenSummary[]
  }
  interface TokenSummary {
    Symbol: string
    Height: number
    ID: string
    Address: string
    Description: string
    IconUrl: string
    Amount?: number // 地址余额
    Decimals?: number // 精度
  }
  export interface AddressBalance {
    Address: string
    Contract: string
    Height: number
    State: {
      Balance: string
    }
  }
  export interface AddressConstractRespone {
    TotalNum: number
    ListData: [{ Contract: string }]
  }
  export interface AddressConstract {
    Address: string
    Contract: string
    Height: number
    Timestamp: number
    State: {
      [key: string]: number | string
    }
    BlockHash: string
  }

  export interface MyTokenRespone {
    TxnStatus: 'Pengding' | 'Failed' | 'Confirme' | 'Finalized'
    TokenAddress: string
    TokenId: number
    Invocation: {
      Input: {
        Symbol: string
        Initial: string
        Flags: number
      }
    }
    BlockTime: number
    TxnTime?: number
  }

  interface MyTokenBase {
    Address: string
    Flags: number
    ID: number
    Symbol: string
    IconUrl: string
    TotalSupply: number
    Status: MyTokenRespone['TxnStatus']
    Time: number
  }
}

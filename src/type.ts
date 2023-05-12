import { ParamType } from 'ethers'

export interface ContractCall {
  contract: {
    address: string
  }
  name: string
  inputs: ParamType[]
  outputs: ParamType[]
  params: any[]
}

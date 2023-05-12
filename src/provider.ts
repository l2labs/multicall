import { Provider as EthersProvider } from 'ethers'
import { getEthBalance, callAll, call3All } from './utils/call'
import { ContractCall } from './type'

const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

export class Provider {
  private _provider: EthersProvider
  private _multicallAddress: string

  constructor(provider: EthersProvider, address = MULTICALL3_ADDRESS) {
    this._provider = provider
    this._multicallAddress = address
  }

  public getEthBalance(address: string) {
    if (!this._provider) {
      throw new Error('Provider should be initialized before use.')
    }
    return getEthBalance(address, this._multicallAddress)
  }

  public async all<T extends any[] = any[]>(calls: ContractCall[]) {
    if (!this._provider) {
      throw new Error('Provider should be initialized before use.')
    }
    return callAll<T>(calls, this._multicallAddress, this._provider)
  }

  public async all3<T extends any[] = any[]>(calls: ContractCall[], allowFailure = false) {
    if (!this._provider) {
      throw new Error('Provider should be initialized before use.')
    }
    return call3All<T>(calls, this._multicallAddress, this._provider, allowFailure)
  }
}

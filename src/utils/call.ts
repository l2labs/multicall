import { Contract } from '../contract'
import { MULTICALL3_ABI } from '../abi/multicall3'
import { ContractCall } from '../type'
import { Provider, Contract as EthersContract } from 'ethers'
import { Abi } from '../abi'

export function getEthBalance(address: string, multicallAddress: string) {
  const multicall = new Contract(multicallAddress, MULTICALL3_ABI)
  return multicall.getEthBalance(address)
}

/**
 * call use multicall
 * @param calls
 * @param multicallAddress
 * @param provider
 * @returns
 */
export async function callAll<T extends any[] = any[]>(
  calls: ContractCall[],
  multicallAddress: string,
  provider: Provider
): Promise<T> {
  const multicall = new EthersContract(multicallAddress, MULTICALL3_ABI, provider)
  const callRequests = calls.map((call) => {
    const callData = Abi.encode(call.name, call.inputs, call.params)
    return {
      target: call.contract.address,
      callData,
    }
  })

  const response = await multicall.aggregate.staticCall(callRequests)
  const callCount = calls.length
  const callResult = [] as unknown as T
  for (let i = 0; i < callCount; i++) {
    const outputs = calls[i].outputs
    const returnData = response.returnData[i]
    const params = Abi.decode(outputs, returnData)
    const result = outputs.length === 1 ? params[0] : params
    callResult.push(result)
  }
  return callResult
}

/**
 * call use multicall3
 * @param calls
 * @param multicallAddress
 * @param provider
 * @param allowFailure
 * @returns
 */
export async function call3All<T extends any[] = any[]>(
  calls: ContractCall[],
  multicallAddress: string,
  provider: Provider,
  allowFailure: boolean
): Promise<T> {
  const multicall = new EthersContract(multicallAddress, MULTICALL3_ABI, provider)
  const callRequests = calls.map((call) => {
    const callData = Abi.encode(call.name, call.inputs, call.params)
    return {
      target: call.contract.address,
      allowFailure,
      callData,
    }
  })
  const response = await multicall.aggregate3.staticCall(callRequests)
  const callCount = calls.length
  const callResult = [] as unknown as T
  for (let i = 0; i < callCount; i++) {
    // @note: call fail
    if (!response[i].success) {
      callResult.push(null)
      continue
    }

    const outputs = calls[i].outputs
    const params = Abi.decode(outputs, response[i].returnData)
    const result = outputs.length === 1 ? params[0] : params
    callResult.push(result)
  }
  return callResult
}

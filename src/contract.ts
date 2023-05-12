import { Fragment, FunctionFragment, JsonFragment, defineProperties } from 'ethers'

function toFragment(abi: Fragment[] | JsonFragment[] | string[]): Fragment[] {
  return abi.map((item: JsonFragment | string | Fragment) => Fragment.from(item))
}

export class Contract {
  private _address: string
  private _abi: Fragment[]
  private _functions: FunctionFragment[]

  constructor(address: string, abi: Fragment[] | JsonFragment[] | string[]) {
    this._address = address
    this._abi = toFragment(abi)

    // @note: filter all functions from abi
    this._functions = this._abi.filter((abi) => abi.type === 'function').map((abi) => FunctionFragment.from(abi))

    // @note: filter all callable functions
    const callFunctions = this._functions.filter((fun) => ['pure', 'view'].includes(fun.stateMutability))

    // @note: register all callable functions to Contract class
    for (const callFun of callFunctions) {
      const { name, inputs, outputs } = callFun
      const address = this.address
      Object.defineProperty(this, name, {
        enumerable: true,
        writable: false,
        value: (...params: any[]) => {
          return {
            contract: { address },
            name,
            inputs,
            outputs,
            params,
          }
        },
      })
    }
  }

  get address() {
    return this._address
  }

  get abi() {
    return this._abi
  }

  get functions() {
    return this._functions
  }

  [method: string]: any
}

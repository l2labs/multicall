import { JsonRpcProvider } from 'ethers'
import { expect } from 'chai'
import { MulticallProvider, MulticallContract } from '../src'
import ERC20_ABI from './abi/erc20'

describe('Test on zksync era:', () => {
  // @note: init provider
  const rpcUrl = 'https://testnet.era.zksync.dev'
  const chainId = 280
  const provider = new JsonRpcProvider(rpcUrl, chainId)

  // @note: init multicall provider
  const multicallAddress = '0x89e4142A30450De077e35cE37f442712005B8c50'
  const multiProvider = new MulticallProvider(provider, multicallAddress)

  it('ERC20 test:', async () => {
    const usdcAddress = '0x4808abfa8058C91cbfD440d94C3631ba51CeB80F'
    const contract = new MulticallContract(usdcAddress, ERC20_ABI)

    const [name, decimals] = await multiProvider.all([contract.name(), contract.decimals()])
    expect(name).to.eq('USDC')
    expect(decimals).to.eq(18n)
  })
})

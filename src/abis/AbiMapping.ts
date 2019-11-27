import { AbiDefinition } from './AbiDefinition'

export class AbiMapping {
  abiMapping: Map<string, AbiDefinition>
  nameToAddressMapping: Map<string, Map<Number, string>>
  addressToAbiMapping: Map<string, Map<Number, AbiDefinition>>

  constructor () {
    this.abiMapping = new Map<string, AbiDefinition>()
    this.nameToAddressMapping = new Map<string, Map<Number, string>>()
    this.addressToAbiMapping = new Map<string, Map<Number, AbiDefinition>>()
  }

  addAbi(name: string, abi: Array<object>): void {
    if (!name) throw `ABI cannot be mapped to a null name`
    if (!abi) throw `ABI cannot be null`
    this.abiMapping[name] = new AbiDefinition(abi)
  }

  getAbiDefinition(name: string): AbiDefinition {
    return this.abiMapping[name]
  }

  addContract(name: string, networkId: Number, address: string, abi: Array<object>) {
    if (!name) throw 'name not defined'
    if (!networkId) throw 'networkId not defined'
    if (!address) throw 'address not defined'
    if (!abi) throw 'abi not defined'

    if (!this.nameToAddressMapping[name]) {
      this.nameToAddressMapping[name] = {}
    }
    if (!this.addressToAbiMapping[address]) {
      this.addressToAbiMapping[address] = {}
    }
    this.nameToAddressMapping[name][networkId] = address
    this.addressToAbiMapping[address][networkId] = new AbiDefinition(abi)
  }

  getContractAbiDefinitionByName(name: string, networkId: Number): AbiDefinition {
    const mapping = this.nameToAddressMapping[name]
    let result
    if (mapping) {
      const address = this.nameToAddressMapping[name][networkId]
      result = this.getContractAbiDefinitionByAddress(address, networkId)
    }
    return result
  }

  getContractAbiDefinitionByAddress(address: string, networkId: Number): AbiDefinition {
    const mapping = this.addressToAbiMapping[address]
    let result
    if (mapping) {
      result = mapping[networkId]
    }
    return result
  }

  getContractAddress(name: string, networkId: Number) {
    if (!this.nameToAddressMapping[name]) {
      return undefined
    }
    return this.nameToAddressMapping[name][networkId]
  }
}
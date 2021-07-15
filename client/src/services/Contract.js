import BettingContractABI from "./contracts/BettingContract.json";
import OracleContractABI from "./contracts/Oracle.json";

class Contract {
  constructor(provider, address, selectedAddress) {
    this.provider = provider;
    this.address = address;
    this.selectedAddress = selectedAddress;
    this.defaultAccount = selectedAddress;
  }

  _setContract() {
    const { eth, utils } = this.provider;
    eth.Contract.setProvider(this.provider);
    this._contract = new eth.Contract(this._abi, this.address, {
      from: this.defaultAccount,
    });
    this._contract.utils = utils;
    this._contract.options.from = this.defaultAccount; // default from address
    this._contract.options.gasPrice = "10000000000"; // default gas price in wei
    this._contract.options.gas = 150000;
  }

  get contract() {
    return this._contract;
  }
}

class BettingContract extends Contract {
  constructor(provider, address, selectedAddress) {
    super(provider, address, selectedAddress);
    this._abi = BettingContractABI.abi;
    this._setContract();
  }
}

class OracleContract extends Contract {
  constructor(provider, address, selectedAddress) {
    super(provider, address, selectedAddress);
    this._abi = OracleContractABI.abi;
    this._setContract();
  }
}

export { BettingContract, OracleContract };

import BettingContractABI from "./contracts/BettingContract.json";

class Contract {
  constructor(provider, address, accounts) {
    this.provider = provider;
    this.address = address;
    this.accounts = accounts;
    this.defaultAccount = accounts[0];
  }

  _setContract() {
    const { eth, utils } = this.provider;
    eth.Contract.setProvider(this.provider);
    this._contract = new eth.Contract(this._abi, this.address, {
      from: this.defaultAccount,
    });
    this._contract.utils = utils;
    this._contract.options.from = this.defaultAccount; // default from address
    this._contract.options.gasPrice = "20000000000000"; // default gas price in wei
    this._contract.options.gas = 100000;
  }

  get contract() {
    return this._contract;
  }
}

class BettingContract extends Contract {
  constructor(provider, address, accounts) {
    super(provider, address, accounts);
    this._abi = BettingContractABI.abi;
    this._setContract();
  }
}

export { BettingContract };

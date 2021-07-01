import BettingContractABI from "./contracts/BettingContract.json";

class Contract {
  constructor(provider, address, accounts) {
    this.provider = provider;
    this.address = address;
    this.accounts = accounts;
    this.defaultAccount = accounts[0];
  }

  _setContract() {
    const { eth } = this.provider;
    eth.Contract.setProvider(this.provider);
    this._contract = new eth.Contract(this._abi, this.address, {
      from: this.defaultAccount,
    });
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

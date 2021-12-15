import { SetStateAction, useState } from 'react'
import { ethers } from 'ethers'
import Polygon_abi from './Polygon_abi.json'
interface Props {

}

const App = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [btnText, setBtnText] = useState('Connect Wallet');
  const [loading, setLoading] = useState(false);

  const [contractName, setContractName] = useState(null);
  const [contractSupply, setContractSupply] = useState<string | null>(null);

  const addressContract = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'

  const connectToWallet = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((res: any) => {
          console.log(res)
          setBtnText('Wallet Connected');
          accountConnected(res[0]);
        })
        .catch((error: { message: SetStateAction<string | null>; }) => {
          setErrorMessage(error.message);
        });

    } else {
      setErrorMessage("Please install MetaMask browser extension to interact");
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000);
    }
  }

  const accountConnected = (account: string) => {
    setAccount(account)
  }

  const getEthers = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()

    try {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(addressContract, Polygon_abi, signer)
      
      setContractName(await contract.name())
      const sup = await contract.totalSupply()
      setContractSupply(parseInt(sup._hex, 16).toLocaleString())
      setLoading(false)
    } catch (e) {
      setLoading(false)
      return e
    }

  }

  return (
    <div className='container row mx-auto'>
      <div className="col-md-4 mx-auto px-5 py-4 border border-info rounded-3 mt-4 d-flex flex-column justify-content-center">
        <div className="alert alert-info" role="alert">
          <p className="mb-0" style={{ fontSize: "0.875rem" }}>You need a <span className="fw-bold">MetaMask</span> wallet to use this DApp.</p>
          <p className="mb-0" style={{ fontSize: "0.875rem" }}>To continue, please add a <span className="fw-bold">MetaMask</span> extension from Chrome store.</p>
        </div>
        <h4 className="fs-6 text-center mt-">Get Contract Details</h4>
        <div className="text-center mt-4">
          <h3 className="fs-6 fw-bold">Connect MetaMask Wallet</h3>
          <span className="" style={{ fontSize: "0.75rem" }}>{account}</span>
        </div>
        <button onClick={connectToWallet} className="btn btn-primary mt-3">{btnText}</button>

        <div className="mt-5">
          <p className="fs-6 mb-2">Contract name: {contractName}</p>
          <p className="fs-6 mb-2">Contract supply: {contractSupply}</p>
        </div>

        <form onSubmit={getEthers} className="w-100 mt-5">
          <label htmlFor="formControlInput" className="form-label mb-0 fw-bold">Contract address</label>
          <input id="formControlInput" type="text" className="w-100 form-control" readOnly value={addressContract} />
          <button type="submit" disabled={loading} className="btn btn-outline-primary w-100 mt-4" style={{ height: "44px" }}>
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : 'Get contract details'}
          </button>
        </form>

        <span>{errorMessage}</span>
      </div>
    </div>
  )
}

export default App

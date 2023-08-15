import { ethers } from "ethers";
import { useState, useEffect } from "react";
import abi from "./contractJson/Wallet.json";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Transactions from "./components/Transactions";
import background from "./img/wallet1.jpg";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    contractRead: null,
  });
  const [balance, setBalance] = useState(null);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState("not connected");

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x2714D6E0D9763843ec5985945d5970aE5df045b3";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        setAccount(accounts);
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const contractRead = new ethers.Contract(contractAddress, contractABI, provider);
        setState({ provider, signer, contract, contractRead });
      } catch (error) {
        alert(error);
      }
    };

    connectWallet();
  }, []);

  const GetBalance = async () => {
    const { contractRead } = state;
    const transaction = await contractRead.getBalances();
    const num = parseInt(transaction) / Math.pow(10, 18);
    setBalance(num);
  };

  const withdraw = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const { contractRead } = state;
    try {
      const tx = await contract.withdraw();
      await tx.wait();
    } catch (error) {
      alert("Empty wallet balance");
    }
  };

  const deposit1 = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const { contractRead } = state;
    const amount1 = document.querySelector("#depositedAmount").value;
    const option = { value: ethers.parseEther(amount1) };
    const transaction = await contract.deposit(option);
    await transaction.wait();
    console.log("Transaction is done");
  };

  const transfer1 = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const addr = document.querySelector("#transferAddress").value;
    const amount = document.querySelector("#transferAmount").value;
    const value = ethers.parseEther(amount);
    console.log(addr);
    try {
      const transaction = await contract.transfer(addr, value);
      await transaction.wait();
    } catch (error) {
      alert("Insufficient Balance");
    }
  };

  const GetOwner = async () => {
    const { contractRead } = state;
    console.log(contractRead);
    const tx = await contractRead.getOwner();
    console.log(tx);
    setOwner(tx);
  };

  return (
    <div className="App">
      <section
        className="body"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="container bg-light rounded p-4">
          <h4 className="text-dark text-center mb-4">
            Connected Wallet: {account}
          </h4>

          <div className="d-flex justify-content-center align-items-center mb-4">
            <button className="btn btn-primary" onClick={GetBalance}>
              Get Balance
            </button>
            <h5 className="text-dark ml-3">Balance: {balance} ETH</h5>
          </div>

          <div className="row">
            <div className="col-md-4">
              <button className="btn btn-danger btn-block" onClick={withdraw}>
                Withdraw
              </button>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                id="transferAddress"
                placeholder="Enter Receiver Address"
                className="form-control mb-2"
              />
              <input
                type="text"
                id="transferAmount"
                placeholder="Enter Amount"
                className="form-control mb-2"
              />
              <button
                className="btn btn-warning btn-block"
                onClick={transfer1}
              >
                Transfer
              </button>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                id="depositedAmount"
                placeholder="Enter Amount to Deposit"
                className="form-control mb-2"
              />
              <button
                className="btn btn-danger btn-block"
                onClick={deposit1}
              >
                Deposit
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-dark"
              onClick={GetOwner}
            >
              Show Owner
            </button>
            <p className="text-dark mt-3">Owner: {owner}</p>
          </div>
        </div>

        <Transactions {...state} />
      </section>
    </div>
  );
}

export default App;

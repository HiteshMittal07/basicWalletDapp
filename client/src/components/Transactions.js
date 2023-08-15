import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";
import "./Transactions.css"; // Import your custom CSS for styling

const Transactions = (props) => {
  const [transactions, setTransactions] = useState([]);
  const { contractRead } = props;

  useEffect(() => {
    const fetchTransactions = async () => {
      const tx = await contractRead.getTransaction();
      setTransactions(tx);
    };
    contractRead && fetchTransactions();
  }, [contractRead]);

  return (
    <div className="transactions-container">
      <h5 className="transactions-heading">Transaction History</h5>
      <div className="table-container">
        <table className="table table-bordered table-hover">
          <thead className="table-header">
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Transaction Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.timestamp}>
                <td>{transaction.from}</td>
                <td>{transaction.to}</td>
                <td>{transaction.operation}</td>
                <td>
                  {parseInt(transaction.amount) / Math.pow(10, 18)} ETH
                </td>
                <td>
                  {moment.unix(parseInt(transaction.timestamp)).format("LLL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;

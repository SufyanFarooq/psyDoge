import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import Web3 from 'web3'

function Header() {
  let accountAd;
  const [account, setAccount] = useState("Connect Wallet");

  let accounts;
  const getAccounts = async () => {
    const web3 = window.web3;
    try {
      accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
      return null;
    }
  };

  const loadWeb3 = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
        console.log("Metamask is not installed, please install it on your browser to connect.");
      }
      if (isConnected === true) {
        let accounts = await getAccounts();
        accountAd = accounts[0];
        accountAd = accounts[0];
        let acc = accountAd.substring(0, 4) + "..." + accountAd.substring(accountAd.length - 4)
        setAccount(acc);

      }
    } catch (error) {
      console.log("Error while connecting metamask", error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      loadWeb3();
    }, 1000);
  });


  return (
    <div className="flex flex-row justify-between h-18 py-4 bg-header none px-6 md:px-10 lg:px-14">
      <img src={logo} alt="logo" />
      <button className="bg-main-color px-3 rounded">{account}</button>
    </div>
  )
}

export default Header

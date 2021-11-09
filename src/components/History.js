import React, { useState, useEffect } from 'react'
import { contractAddress, abi } from '../utils/constant'
import Web3 from 'web3'

function History() {
    let accountAd;
    const [eventData, setEventData] = useState([])

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


    const getContractTransferEventsByUser = async () => {
        let accounts = await getAccounts();
        accountAd = accounts[0];
        let newArr = [];
        let result = [];
        const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
        let contract = new web3.eth.Contract(abi, contractAddress);
        try {
            let continueToken = "";
            var instructorEvent = await contract.getPastEvents('BetAmount', {
                fromBlock: 12733903,
                toBlock: 12738903,
            }, function (error, events) {

                if (events) {
                    events.forEach((element) => {
                        console.log(element.transactionHash)
                        console.log("Event Data", element);
                        if (element?.returnValues?.user === accountAd) {
                            let amount = element?.returnValues?.amount;
                            let card = element?.returnValues?.card
                            let time = element?.returnValues?.time;
                            let txid = element?.transactionHash;
                            newArr.push({
                                amount: amount,
                                card: card,
                                time: time,
                                txid: txid
                            });

                        }
                    });
                }
                setEventData(newArr);

            }).then(function (events) {
            });
        } catch (error) {
            console.error("getEvents", error);
        } finally {
            return result;
        }
    };
    console.log("Event Data", eventData)

    useEffect(() => {
        getContractTransferEventsByUser();
    }, []);

    return (

        <div className="flex flex-row justify-center pt-0 xsm:pt-10 sm:pt-12 mb-6 px-6 md:px-10 lg:px-14">
            <div>
                <h3 className="text-white text-xl font-bold">Your History</h3>
                <div className="xsm:w-72 sm:w-94 overflow-x-scroll">
                    <table className=" text-white rounded-t-lg mt-4">
                        <thead>
                            <tr className="bg-header text-left text-sm md:text-base">
                                <th className="px-4 py-2 xsm:px-2 sm:px-4 md:px-7 lg:px-10 sm:py-4  border-r border-b border-black rounded-tl-lg">Date</th>
                                <th className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">Ticket No.</th>
                                <th className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">Bet</th>
                                <th className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">Reward</th>
                                <th className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">Results</th>
                                <th className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">Profit</th>
                                <th className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-b border-black rounded-tr-lg">TXID</th>
                            </tr>
                        </thead>
                        {
                            eventData && eventData.map(item => {
                                var date = new Date(item.time * 1000);
                                return (
                                    <tbody>
                                        <tr className="bg-tcolor text-left text-sm md:text-base">
                                            <td className="px-4 py-2 xsm:px-2 sm:px-4 md:px-7 lg:px-10 sm:py-4 border-r border-b border-black">{date.getDate() +
                                                "/" + (date.getMonth() + 1) +
                                                "/" + date.getFullYear()}</td>
                                            <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{item.card}</td>
                                            <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black truncate">{Web3.utils.fromWei(item.amount)}</td>
                                            {
                                                item.card === "1" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 0.5 + "")}</td> :
                                                    item.card === "2" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 1 + "")}</td> :
                                                        item.card === "3" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 1.5 + "")}</td> :
                                                            item.card === "4" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 2 + "")}</td> :
                                                                item.card === "5" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 5 + "")}</td> :
                                                                    item.card === "6" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 10 + "")}</td> :
                                                                        null
                                            }
                                            {
                                                item.card === "1" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{0.5}</td> :
                                                    item.card === "2" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{1}</td> :
                                                        item.card === "3" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{1.5}</td> :
                                                            item.card === "4" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{2}</td> :
                                                                item.card === "5" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{5}</td> :
                                                                    item.card === "6" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{10}</td> :
                                                                        null

                                            }
                                            {
                                                item.card === "1" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 0.5 - item.amount + "")}</td> :
                                                    item.card === "2" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 1 - item.amount + "")}</td> :
                                                        item.card === "3" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 1.5 - item.amount + "")}</td> :
                                                            item.card === "4" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 2 - item.amount + "")}</td> :
                                                                item.card === "5" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 5 - item.amount + "")}</td> :
                                                                    item.card === "6" ? <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-r border-b border-black">{Web3.utils.fromWei(item.amount * 10 - item.amount + "")}</td> :
                                                                        null

                                            }
                                            <td className="px-3 xsm:px-2 sm:px-4 md:px-7 lg:px-10 border-b border-black truncate">{item.txid.substring(0, 4) + "..." + item.txid.substring(item.txid.length - 4)}{ }</td>
                                        </tr>
                                    </tbody>
                                )
                            })
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}

export default History
import React, { useState, useEffect } from 'react'
import disc from '../assets/list-item.png'
import One from '../assets/1.jpg'
import Two from '../assets/2.jpg'
import Three from '../assets/3.jpg'
import Four from '../assets/4.jpg'
import Five from '../assets/5.jpg'
import Six from '../assets/6.jpg'
import handIcon from '../assets/hand.png'
import { contractAddress, abi, tokenAddress, tokenAbi } from '../utils/constant'
import Web3 from 'web3'
import '../styles/Hero.css'
import Slider from "react-slick";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Congratulation from '../assets/image1.png'



function Hero() {
    let accountAd;
    const [value, setValue] = useState("")
    const [account, setAccount] = useState("Connect Wallet");
    const [button, setButton] = useState("Bet Now!")
    const [buttonState, setButtonState] = useState(false)
    const [cards, setCards] = useState()
    const [comp, setComp] = useState(true)
    const [cardData, setCardData] = useState()
    const [withDraw, setWithDraw] = useState("Withdraw")
    const [mybalance, setMybalance] = useState("")
    const [cardList, setCardList] = useState([])
    const [total, setTotal] = useState()
    const [compWithdraw, setCompWithdraw] = useState(true)
    const [checkOut, setCheckOut] = useState(true)
    const [withDrawButton, setWithDrawButton] = useState("Checkout")
    const [cardImage, setCardImage] = useState("")
    const [indexes, setIndexes] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [modal, setModal] = useState()

    const handleModal = (e) => {
        setShowModal(true)
        setModal(e.target.id)
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

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
        const web3 = window.web3;
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
                setAccount(accountAd);
                balanceOf()
            }
            imgFun();
        } catch (error) {
            console.log("Error while connecting metamask", error);
        }
    };


    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const balanceOf = async () => {
        const web3 = window.web3;
        try {
            let accounts = await getAccounts();
            accountAd = accounts[0];
            let tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
            let myBalance = await tokenContract.methods.balanceOf(accountAd).call();
            let convertedBalanc = await window.web3.utils.fromWei(myBalance)
            setMybalance(convertedBalanc)
        } catch (error) {
            console.log("Error while fetching acounts: ", error);

        }
    };

    let cardNo;
    const handleClick = async () => {
        const web3 = window.web3;
        setButton("Please wait while processing...");
        setButtonState(true);
        console.log(buttonState)
        try {
            console.log(account)
            let contract = new web3.eth.Contract(abi, contractAddress);
            let tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
            if (value >= 100 && value <= 40000) {
                await tokenContract.methods.approve(contractAddress, web3.utils.toWei(value)).send({ from: account })
                    .then(async (output) => {
                        await contract.methods.Bet_Amount(web3.utils.toWei(value)).send({ from: account })
                            .then(async (output) => {
                                cardNo = await contract.methods.UserInfo(account).call()
                                console.log("num of cards", cardNo)
                                toast.success("Card purchase successfully");
                            }).catch((e) => {
                                console.log("response", e);
                                toast.error("Error occured while purchasing card.");
                            });
                        loadWeb3();
                    }).catch((e) => {
                        toast.error("Card purchase rejected");
                        console.log("response", e);
                    });
            } else {
                alert('Minimum Bet 100 and Maximum Bet 40,000')
            }
            setValue("")
            setButtonState(false)
            setButton("Bet Now!")
        } catch (error) {
            console.log("Error while fetching acounts: ", error);

        }
    }


    const imgFun = async () => {
        const web3 = window.web3;
        try {
            let contract = new web3.eth.Contract(abi, contractAddress);
            const card = await contract.methods.UserInfo(accountAd).call()
            console.log(card[1])
            setCards(card[1])
            console.log(card[1])
        } catch (error) {
            console.log("Error while fetching acounts: ", error);

        }
    }

    let cardsArray = []
    let indexesArray = []
    let pricesArray = []
    const handleCard = async (e) => {
        let id = e.target.id
        const web3 = window.web3;
        try {
            let contract = new web3.eth.Contract(abi, contractAddress);
            const card = await contract.methods.UserInfo(account).call();
            console.log(card)
            let CardNo = card[1];
            let CardValue = card[2]
            if (cardList.length === 0) {
                cardsArray.push([CardNo[id], CardValue[id]]);
                pricesArray.push(CardNo[id]);
                indexesArray.push(id)
            } else {
                cardsArray.push([CardNo[id], CardValue[id]]);
                indexesArray.push(id)
                pricesArray.push(CardNo[id]);
            }
            let newCards = [...cards]
            newCards[id] = ""
            setCards(newCards)
            let newList = cardList.concat(cardsArray)
            let newIndexes = indexes.concat(indexesArray)
            setIndexes(newIndexes)
            setCardList(newList);
            setComp(false)

            let result = 0;
            newList.map(async (item) => {
                console.log(item)
                console.log(item)
                let v = Web3.utils.fromWei(item[1])
                let a = parseFloat(v);
                result += a;
            })
            setTotal(result);

        } catch (e) {
            console.log(e)
        }
    }

    const imageSlider = () => {
        try {
            let i = 1;

            setInterval(() => {

                if (i < cardList.length) {
                    let currentImage = cardList[i].Card_No;
                    if (currentImage === "1") {
                        setCardImage(1)
                    } else if (currentImage === "2") {
                        setCardImage(2)
                    } else if (currentImage === "3") {
                        setCardImage(3)
                    } else if (currentImage === "4") {
                        setCardImage(4)
                    } else if (currentImage === "5") {
                        setCardImage(5)
                    } else if (currentImage === "6") {
                        setCardImage(6)
                    } else {
                        return null
                    }
                }
            }
                , 5000)
            i++;
            console.log(i)

        } catch (error) {
            console.log(error)
        }
    }



    const handleWithdraw = async () => {
        const web3 = window.web3;
        let contract = new web3.eth.Contract(abi, contractAddress);
        setWithDraw("Please wait while processing...")
        try {
            await contract.methods.withdraw(indexes).send({ from: account })
            setWithDraw("Withdraw")
            setCardList([])
            setCheckOut(false)
            setWithDraw("Bet/Withdraw Again")
            toast.success("Withdraw amount successfully");
            loadWeb3();
        } catch (e) {
            toast.error("Withdraw Rejected");
            setWithDraw("Withdraw")
            console.log(e)
        }
    }

    const handleCheckout = async () => {
        setWithDrawButton("Withdraw")
        setCompWithdraw(false)
        setCardData(cardList)
        imageSlider()
    }

    const handleCongrats = () => {
        setCardList([])
        setIndexes([])
        setWithDraw("Withdraw")
        setComp(true)
        setCompWithdraw(true)
        setCheckOut(true)

    }


    useEffect(() => {
        loadWeb3();
    }, []);

    return (
        <div className="lg:bg-hero-background bg-gradient-to-b from-primary to-secondary bg-no-repeat bg-contain bg-top h-1/5 none px-6 md:px-10 lg:px-14 flex flex-col xl:flex-row lg:flex-col md:flex-col sm:flex-col justify-around">
            <div className="py-12 xl:py-10 2xl:w-7/12 xl:w-6/12">
                <h1 className="text-4.5xl  text-pure-white font-bold">Random Card Want?</h1>
                <ul className="list-inside flex flex-col flex-wrap my-16">
                    <div className="flex flex-row items-start mb-2 lg:items-center md:items-center sm:items-center">
                        <img src={disc} alt='icon' className="w-4 h-4 mr-4 p-0.5" />
                        <li className="text-pure-white text-base sm:text-lg md:text-xl lg:text-xl" key="1">You can earn Psydoge token reward with challenge !</li>
                    </div>
                    <div className="flex flex-row items-start mb-2 lg:items-center md:items-center sm:items-center">
                        <img src={disc} alt='icon' className="w-4 h-4 mr-4 p-0.5" />
                        <li className="text-pure-white text-base sm:text-lg md:text-xl lg:text-xl" key="2">Bet and increase your token balance.</li>
                    </div>
                    <div className="flex flex-row items-start mb-2 lg:items-center md:items-center sm:items-start">
                        <img src={disc} alt='icon' className="w-4 h-4 mr-4 sm:mt-1 p-0.5" />
                        <li className="text-pure-white text-base sm:text-lg md:text-xl lg:text-xl" key="3">The pool amount of this game will be used to be special events. <strong>Good Luck!</strong></li>
                    </div>
                </ul>
                <div className="flex flex-row flex-wrap justify-center lg:justify-start md:justify-start sm-justify-start">
                <img src={One} alt="img1" className="mr-4 mb-4 cursor-pointer" key="1" id="1" width="95px" onClick={handleModal} />
                    <img src={Two} alt="img2" className="mr-4 mb-4 cursor-pointer" key="2" id="2" width="95px" onClick={handleModal} />
                    <img src={Three} alt="img3" className="mr-4 mb-4 cursor-pointer" key="3" id="3" width="95px" onClick={handleModal} />
                    <img src={Four} alt="img4" className="mr-4 mb-4 cursor-pointer" key="4" id="4" width="95px" onClick={handleModal} />
                    <img src={Five} alt="img5" className="mr-4 mb-4 cursor-pointer" key="5" id="5" width="95px" onClick={handleModal} />
                    <img src={Six} alt="img6" className="mr-4 mb-4 cursor-pointer" key="6" id="6" width="95px" onClick={handleModal} />


                </div>
                {showModal ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dt-gr p-6  outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    </div>
                                    {
                                        (modal === "1") ? <img src={One} alt="img1" className="w-64 h-72" /> :
                                            (modal === "2") ? <img src={Two} alt="img2" className="w-64 h-72" /> :
                                                (modal === "3") ? <img src={Three} alt="img3" className="w-64 h-72" /> :
                                                    (modal === "4") ? <img src={Four} alt="img3" className="w-64 h-72" /> :
                                                        (modal === "5") ? <img src={Five} alt="img5" className="w-64 h-72" /> :
                                                            (modal === "6") ? <img src={Six} alt="img6" className="w-64 h-72" /> :
                                                                null
                                    }
                                    <div className="flex items-center justify-end pt-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button className="text-white background-transparent font-bold uppercase text-sm outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button" onClick={() => setShowModal(false)} >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
                <div className="flex flex-row flex-wrap justify-center lg:justify-start md:justify-start sm-justify-start">
                    {
                        cards && cards.map((item, index) => {
                            return (item === "1") ? <img src={One} alt="img1" className="mr-4 mb-4 cursor-pointer" key={index} id={index} onClick={handleCard}  width="95px" /> :
                                (item === "2") ? <img src={Two} alt="img2" className="mr-4 mb-4 cursor-pointer" key={index} id={index} onClick={handleCard}   width="95px"/> :
                                    (item === "3") ? <img src={Three} alt="img3" className="mr-4 mb-4 cursor-pointer" key={index} id={index} onClick={handleCard}   width="95px"/> :
                                        (item === "4") ? <img src={Four} alt="img3" className="mr-4 mb-4 cursor-pointer" key={index} id={index} onClick={handleCard}  width="95px" /> :
                                            (item === "5") ? <img src={Five} alt="img5" className="mr-4 mb-4 cursor-pointer" key={index} id={index} onClick={handleCard}  width="95px" /> :
                                                (item === "6") ? <img src={Six} alt="img6" className="mr-4 mb-4 cursor-pointer" key={index} id={index} onClick={handleCard}  width="95px" /> :
                                                    null;

                        }
                        )
                    }
                </div>
              



                <p className="text-xl text-pure-white font-semibold mt-20">If you bet 100 PSYD token (min bet 100, max bet 40,000)</p>
                <div className="flex flex-row align-center justify-center sm:flex-col">
                    <table className=" text-white rounded-t-lg mt-4">
                        <thead>
                            <tr className="bg-highlighted text-left text-sm md:text-base">
                                <th className="px-4 py-2 xsm:px-2 sm:px-6 md:px-8 sm:py-4  border-r border-b border-black rounded-tl-lg">Type</th>
                                <th className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">Bet</th>
                                <th className="px-3 xsm:px-2 sm:px-6 border-r border-b border-black">Reward</th>
                                <th className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">Payout</th>
                                <th className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">Profit</th>
                                <th className="px-3 xsm:px-2 sm:px-6  border-b border-black rounded-tr-lg">Odds</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-tcolor text-left text-sm md:text-base">
                                <td className="px-4 py-2 xsm:px-2 sm:px-6 md:px-8 sm:py-4 border-r border-b border-black">Level 1 (WIND)</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">100</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">50</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">-x0.5</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">-50</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-b border-black">68%</td>
                            </tr>
                            <tr className="bg-tcolor text-left text-sm md:text-base">
                                <td className="px-4 py-2 xsm:px-2 sm:px-6 md:px-8 sm:py-4  border-r border-b border-black">Level 2 (WATER)</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">100</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">100</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">x1.0</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">0</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-b border-black">16%</td>
                            </tr>
                            <tr className="bg-tcolor text-left text-sm md:text-base">
                                <td className="px-4 py-2 xsm:px-2 sm:px-6 md:px-8 sm:py-4  border-r border-b border-black">Level 3 (FIRE)</td>
                                <td className="px-3 xsm:px-2 sm:px-6 border-r border-b border-black">100</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">150</td>
                                <td className="px-3 xsm:px-2 sm:px-6 border-r border-b border-black">x1.5</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">+50</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-b border-black">8%</td>
                            </tr>
                            <tr className="bg-tcolor text-sm md:text-base">
                                <td className="px-4 py-2 xsm:px-2 sm:px-6 md:px-8 sm:py-4 border-r border-b border-black">Level 4 (LIGHT)</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">100</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">200</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">x2.0</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">+100</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-b border-black">5%</td>
                            </tr>
                            <tr className="bg-tcolor text-left text-sm md:text-base">
                                <td className="px-4 py-2 xsm:px-2 sm:px-6 md:px-8 sm:py-4 border-r border-b border-black">Level 5 (EARTH)</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">100</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">500</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">x5.0</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-b border-black">+400</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-b border-black">2%</td>
                            </tr>
                            <tr className="bg-tcolor text-left text-sm md:text-base">
                                <td className="px-4 py-2 xsm:px-2 sm:px-6 md:px-8 sm:py-4  border-r border-black rounded-bl-lg">Level 6 (DARK)</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-black">100</td>
                                <td className="px-3 xsm:px-2 sm:px-6 border-r border-black">1000</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-black">x10.0</td>
                                <td className="px-3 xsm:px-2 sm:px-6  border-r border-black">+900</td>
                                <td className="px-3 xsm:px-2 sm:px-6 border-black rounded-br-lg">1%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mb-0 xl:ml-10 2xl:ml-0">
                {
                    comp ?
                        (<div className=" mt-6 lg:mt-28 md:mt-18 sm:mt-12 bg-dt-gr py-8 lg:py-12 md:py-10 sm:py-9 px-8 lg:px-12 md:px-10 sm:px-9">
                            <h2 className="text-4xl text-main font-semibold">Game Rules</h2>
                            <ul className="list-inside flex flex-col flex-wrap my-12">
                                <div className="flex flex-row items-start mb-1 lg:items-center md:items-center sm:items-center">
                                    <img src={handIcon} alt='icon' className="w-9 h-9 mr-4 p-0.5" />
                                    <li className="text-pure-white text-base sm:text-lg md:text-xl lg:text-xl" key="9">6 level card can be selected with random game.</li>
                                </div>
                                <div className="flex flex-row items-start mb-1 lg:items-center md:items-center sm:items-center">
                                    <img src={handIcon} alt='icon' className="w-9 h-9 mr-4 p-0.5" />
                                    <li className="text-pure-white text-base sm:text-lg md:text-xl lg:text-xl" key="8">All card have different token reward value</li>
                                </div>
                                <div className="flex flex-row items-start mb-1 lg:items-center md:items-center sm:items-start">
                                    <img src={handIcon} alt='icon' className="w-9 h-9 mr-4 sm:mt-1 p-0.5" />
                                    <li className="text-pure-white text-base sm:text-lg md:text-xl lg:text-xl" key="7">Min Bet is 100 PSYD Token, Max Bet is 40,000 PSYD Token</li>
                                </div>
                            </ul>
                        </div>
                        )
                        :
                        compWithdraw ?
                            (<div className="h-auto w-12/12 mt-6 lg:mt-28 md:mt-18 sm:mt-12 bg-dt-gr py-2 lg:py-6 md:py-6 sm:py-4 px-2 lg:px-6 md:px-6 sm:px-4">
                                <h2 className="text-4xl text-main font-semibold">Checkout</h2>
                                <div className="py-4 px-4 bg-dark flex flex-row justify-between mt-4">
                                    <label className="text-main text-xl font-semibold">Item</label>
                                    <label className="text-main text-xl font-semibold">Quantity</label>
                                    <label className="text-main text-xl font-semibold">Bet amount</label>
                                </div>
                                <div className="mt-4 overflow-auto h-56">
                                    {
                                        cardList && cardList?.map((item, index) => {
                                            return (item[0] === "1") ? <div className="flex flex-row items-center justify-start sm:justify-start"><img src={One} alt="img1" className="mr-4 mb-2 w-16 h-20" key={index} /><div className="ml-16 mr-24"><p className="text-white text-lg">1</p></div><div><p className="text-white text-lg mr-6"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div> :
                                                (item[0] === "2") ? <div className="flex flex-row items-center justify-start sm:justify-start"><img src={Two} alt="img1" className="mr-4 mb-2 w-16 h-20" key={index} /><div className="ml-16 mr-24"><p className="text-white text-lg">1</p></div><div><p className="text-white text-lg mr-6"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div> :
                                                    (item[0] === "3") ? <div className="flex flex-row items-center justify-start sm:justify-start"><img src={Three} alt="img1" className="mr-4 mb-2 w-16 h-20" key={index} /><div className="ml-16 mr-24"><p className="text-white text-lg">1</p></div><div><p className="text-white text-lg mr-6"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div> :
                                                        (item[0] === "4") ? <div className="flex flex-row items-center justify-start sm:justify-start"><img src={Four} alt="img1" className="mr-4 mb-2 w-16 h-20" key={index} /><div className="ml-16 mr-24"><p className="text-white text-lg">1</p></div><div><p className="text-white text-lg mr-6"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div> :
                                                            (item[0] === "5") ? <div className="flex flex-row items-center justify-start sm:justify-start"><img src={Five} alt="img1" className="mr-4 mb-2 w-16 h-20" key={index} /><div className="ml-16 mr-24"><p className="text-white text-lg">1</p></div><div><p className="text-white text-lg mr-6"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div> :
                                                                (item[0] === "6") ? <div className="flex flex-row items-center justify-start sm:justify-start"><img src={Six} alt="img1" className="mr-4 mb-2 w-16 h-20" key={index} /><div className="ml-16 mr-24"><p className="text-white text-lg">1</p></div><div><p className="text-white text-lg mr-6"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div> :
                                                                    null;
                                        })
                                    }
                                </div>
                            </div>
                            )
                            :
                            checkOut ?
                                (<div className=" mt-6 lg:mt-28 md:mt-18 sm:mt-12 bg-dt-gr py-8 lg:py-12 md:py-10 sm:py-9 px-8 lg:px-12 md:px-10 sm:px-9">
                                    <h2 className="text-xl msm:text-4xl sm:text-4xl text-main font-semibold text-start">WITHDRAW AMOUNT</h2>
                                    <Slider {...settings} className="w-96">

                                        {cardList.map(item => {
                                            return (item[0] === "1") ? <div className="flex flex-row !important items-center justify-start sm:justify-start"><img src={One} alt="img1" className="mr-4 mb-4 w-30 h-48 mt-6" /><div><h4 className="text-main text-xl font-semibold">#2021 Wind Psydoge</h4><h3 className="text-main text-xl sm:text-2xl font-bold">Level: 1 (WIND)</h3><p className="mt-6 text-main font-semibold text-lg">Your Reward:</p><p className="text-white text-lg"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div>
                                                : (item[0] === "2") ? <div className="flex flex-row !important items-center justify-start sm:justify-start "><img src={Two} alt="img1" className="mr-4 mb-4 w-30 h-48 mt-6" /><div><h4 className="text-main text-xl font-semibold">#2021 Water Psydoge</h4><h3 className="text-main text-xl sm:text-2xl font-bold">Level: 2 (WATER)</h3><p className="mt-6 text-main font-semibold text-lg">Your Reward:</p><p className="text-white text-lg"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div>
                                                    : (item[0] === "3") ? <div className="flex flex-row !important items-center justify-start sm:justify-start "><img src={Three} alt="img1" className="mr-4 mb-4 w-30 h-48 mt-6" /><div><h4 className="text-main text-xl font-semibold">#2021 Fire Psydoge</h4><h3 className="text-main text-xl sm:text-2xl font-bold">Level: 3 (FIRE)</h3><p className="mt-6 text-main font-semibold text-lg">Your Reward:</p><p className="text-white text-lg"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div>
                                                        : (item[0] === "4") ? <div className="flex flex-row !important items-center justify-start sm:justify-start "><img src={Four} alt="img1" className="mr-4 mb-4 w-30 h-48 mt-6" /><div><h4 className="text-main text-xl font-semibold">#2021 Light Psydoge</h4><h3 className="text-main text-xl sm:text-2xl font-bold">Level: 4 (LIGHT)</h3><p className="mt-6 text-main font-semibold text-lg">Your Reward:</p><p className="text-white text-lg"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div>
                                                            : (item[0] === "5") ? <div className="flex flex-row !important items-center justify-start sm:justify-start "><img src={Five} alt="img1" className="mr-4 mb-4 w-30 h-48 mt-6" /><div><h4 className="text-main text-xl font-semibold">#2021 Earth Psydoge</h4><h3 className="text-main text-xl sm:text-2xl font-bold">Level: 5 (EARTH)</h3><p className="mt-6 text-main font-semibold text-lg">Your Reward:</p><p className="text-white text-lg"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div>
                                                                : (item[0] === "6") ? <div className="flex flex-row !important items-center justify-start sm:justify-start "><img src={Six} alt="img1" className="mr-4 mb-4 w-30 h-48 mt-6" /><div><h4 className="text-main text-xl font-semibold">#2021 Dark Psydoge</h4><h3 className="text-main text-xl sm:text-2xl font-bold">Level: 6 (DARK)</h3><p className="mt-6 text-main font-semibold text-lg">Your Reward:</p><p className="text-white text-lg"> {Web3.utils.fromWei(item[1])} PSYD</p></div></div>
                                                                    : null

                                        })
                                        }

                                    </Slider>
                                </div>
                                ) :
                                (
                                    <div className=" mt-6 lg:mt-28 md:mt-18 sm:mt-12 bg-dt-gr py-8 lg:py-12 md:py-10 sm:py-9 px-8 lg:px-12 md:px-10 sm:px-9 flex flex-col justify-center items-center">
                                        <h2 className="text-xl msm:text-4xl sm:text-4xl text-main font-semibold text-start">CONGRATULATIONS</h2>
                                        <img src={Congratulation} alt="congrats" className="mt-12" />
                                    </div>
                                )

                }

                <div className=" divide-y bg-seondary-color py-8 lg:py-12 md:py-10 sm:py-9 px-8 lg:px-12 md:px-10 sm:px-9">
                    {
                        comp ?
                            <>
                                <div className="flex flex-row items-center justify-between mb-4">
                                    <h3 className="sm:text-2xl xsm:text-lg text-main font-semibold">My Wallet</h3>
                                    <span className="sm:text-xl xsm:text-md text-white font-semibold">{mybalance} PSYD</span>
                                </div>
                                <li className=" hidden text-pure-white text-base sm:text-lg md:text-xl lg:text-xl">6 level card can be selected with random game.</li>
                                <div className="flex flex-row items-center justify-between py-4">
                                    <h3 className="sm:text-2xl xsm:text-lg text-main font-semibold">Bet Amount</h3>
                                    <div>
                                        <input className="bg-dt-gr text-white focus:ring-2 border border-gray-500 focus:border-gray-600 xsm:w-32 sm:w-48 md:w-40 lg:w-32  py-2 px-4 rounded mr-6" type="number" min="100" max="1000" onChange={handleChange} value={value} />
                                        <span className="sm:text-xl xsm:text-lg text-white font-semibold">PSYD</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <p className="py-3 text-white">*Min bet 100 token, Max bet 40,000 token</p>
                                    <button className="bg-main-color px-3 rounded mt-10 w-full py-4 font-bold disabled:bg-header0" onClick={handleClick} disabled={buttonState}>{button}</button>
                                </div>
                            </>
                            :
                            compWithdraw ?

                                <div className="mt-6 flex flex-col">
                                    <hr />
                                    <div className="flex flex-row justify-between">
                                        <h3 className="sm:text-2xl xsm:text-lg md:text-lg text-main font-semibold my-4">Total</h3>
                                        <h3 className="sm:text-2xl xsm:text-lg md:text-lg text-white font-semibold my-4">{total}</h3>
                                    </div>
                                    <hr />
                                    <button className="bg-main-color px-3 rounded mt-10 w-full py-4 font-bold disabled:bg-header0" onClick={handleCheckout}>{withDrawButton}</button>
                                </div>
                                :
                                checkOut ?
                                    <div className="mt-6 flex flex-col">
                                        <p className="py-3 text-white text-center">Click withdraw button to send token to your wallet</p>
                                        <button className="bg-main-color px-3 rounded mt-10 w-full py-4 font-bold disabled:bg-header0" onClick={handleWithdraw} disabled={buttonState}>{withDraw}</button>
                                    </div>
                                    :
                                    <div className="mt-6 flex flex-col">
                                        <button className="bg-main-color px-3 rounded mt-10 w-full py-4 font-bold disabled:bg-header0" onClick={handleCongrats} disabled={buttonState}>{withDraw}</button>
                                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Hero

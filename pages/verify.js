import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import React from "react";
import styles from '../styles/Home.module.css';
import { CopyToClipboard } from "react-copy-to-clipboard";

import VerifyABI from '../build/contracts/VerifySignature.json';

import Web3 from 'web3';
import Web3Modal from 'web3modal'
import { checkingAddress, checkingMessage, checkingNumbers } from './utils';


export default function Verify() {
    const [myWeb3Modal, setMyWeb3Modal] = useState(null);

    const [formInput, updateFormInput] = useState({ address: '', amount: '', message: '', nonce: '' });
    const [signature, setSignature] = useState(null);
    const [signer, setSigner] = useState(null);

    const [copied, setCopied] = useState(false);

    const contractAddress = "0xde052Ea17F1Bd1AA8A7C99337a1801744aA8edED";

    useEffect(() => {
        checking_connection();
    }, [myWeb3Modal]);



    async function checking_connection() {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();

            if (connection.isConnected()) {
                setMyWeb3Modal(connection);
            }
        } catch (e) {
            console.log("Little connection error!");
        }
    }


    async function verify_signature() {
        var { address, amount, message, nonce } = formInput;
        address = await checkingAddress(address);
        message = await checkingMessage(message);
        amount = await checkingNumbers(amount);
        nonce = await checkingNumbers(nonce);
        updateFormInput({ address: address, amount: amount, message: message, nonce: nonce });

        const web3 = new Web3(myWeb3Modal);

        const verify = new web3.eth.Contract(VerifyABI.abi, contractAddress);
        const my_signer = await verify.methods.verifySigner(address, amount, message, nonce, signature).call();

        setSigner(my_signer);
    }




    if (!myWeb3Modal) return (
        <React.Fragment>
            <div className={styles.container}>
                <main className={styles.main}>
                    <h4 className={styles.title}>
                        Not connected!
                    </h4>
                    <div className="w-1/2 flex flex-col pb-12">
                        <button onClick={checking_connection}
                            className="font-bold mt-4 bg-sky-900 text-white rounded p-4 shadow-lg"
                        >Connect</button>
                    </div>

                </main>

                <footer className={styles.footer}>
                    <h1 className={styles.title}>
                        Powered by KENAT
                    </h1>

                </footer>
            </div>


        </React.Fragment>
    )



    return (

        <React.Fragment>
            <div className={styles.container}>
                <main className={styles.main}>
                    <h4 className={styles.title}>
                        Verify
                    </h4>
                    <div className="w-1/2 flex flex-col pb-12">
                        <input
                            placeholder="Address to"
                            className="mt-8 border rounded p-4"
                            onChange={e => updateFormInput({ ...formInput, address: e.target.value })}
                        />
                        <input
                            placeholder="Enter amount"
                            className="mt-8 border rounded p-4"
                            type="number"
                            onChange={e => updateFormInput({ ...formInput, amount: e.target.value })}
                        />
                        <textarea
                            placeholder="Enter message"
                            className="mt-2 border rounded p-4"
                            onChange={e => updateFormInput({ ...formInput, message: e.target.value })}
                        />
                        <input
                            placeholder="Enter nonce"
                            className="mt-8 border rounded p-4"
                            type="number"
                            onChange={e => updateFormInput({ ...formInput, nonce: e.target.value })}
                        />
                        <input
                            placeholder="Enter signature"
                            className="mt-8 border rounded p-4"
                            onChange={e => setSignature(e.target.value)}
                        />
                        <button onClick={verify_signature}
                            className="font-bold mt-4 bg-sky-900 text-white rounded p-4 shadow-lg"
                        >Verify Signature</button>
                    </div>
                    {Boolean(!signer) ? null :
                        <div className="grid grid-rows-2 grid-flow-col gap-4">
                            <div className="row-span-3 mt-8 rounded p-4">
                                <div className="my-4 ...">Signer: </div>
                            </div>
                            <div className="col-span-2 mt-8 border rounded p-4">
                                <div className="my-4 ...">{signer}</div>
                            </div>
                            <div className="row-start-1 row-end-4 content-end rounded p-4">
                                <CopyToClipboard text={signer}
                                    onCopy={() => setCopied(true)}>
                                    <button
                                        className="font-bold mt-8 bg-sky-900 text-white rounded p-4 shadow-lg"
                                    >Copy</button>
                                </CopyToClipboard>
                            </div>
                        </div>

                    }
                </main>
                <footer className={styles.footer}>
                    <h1 className={styles.title}>
                        Powered by KENAT
                    </h1>

                </footer>
            </div>
        </React.Fragment>
    )



}
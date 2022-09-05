import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification } from "web3uikit";

type contractAddressesInterface = {
    [key: string]: string[];
};

export const RaffleEntrance = () => {
    const dispatch = useNotification();
    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState<string>("0");
    const formattedEntranceFee = ethers.utils.formatEther(entranceFee);
    const [numPlayer, setNumPlayer] = useState<string>("0");
    const [recentWinner, setRecentWinner] = useState<string>("0");

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getRecentWinner",
        params: {},
    });

    const updateUI = async () => {
        const entranceFeeFromCall = ((await getEntranceFee()) as BigNumber).toString();
        const numPlayerFromCall = ((await getNumberOfPlayers()) as BigNumber).toString();
        const recentWinnerFromCall = (await getRecentWinner()) as string;
        setEntranceFee(entranceFeeFromCall);
        setNumPlayer(numPlayerFromCall);
        setRecentWinner(recentWinnerFromCall);
    };

    useEffect(() => {
        if (isWeb3Enabled && raffleAddress) {
            updateUI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWeb3Enabled]);

    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait(1);
        handleNewNotification();
        updateUI();
    };

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            title: "Tx Notification",
            message: "Transaction complete!",
            position: "topR",
        });
    };

    return (
        <section className="p-5">
            {raffleAddress ? (
                <div>
                    <p>Entrance Fee: {formattedEntranceFee} eth</p>
                    <p>Number of Players: {numPlayer}</p>
                    <p>Recent Winner: {recentWinner}</p>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        disabled={isLoading || isFetching}
                        onClick={async () =>
                            await enterRaffle({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            })
                        }
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" />
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                </div>
            ) : (
                <p>Wrong network!</p>
            )}
        </section>
    );
};

import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

type contractAddressesInterface = {
    [key: string]: string[];
};

export const RaffleEntrance = () => {
    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;

    // const { runContractFunction: enterRaffle } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress!,
    //     functionName: "enterRaffle",
    //     params: {},
    //     msgValue: "",
    // });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "getEntranceFee",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            const updateUI = async () => {
                const entranceFee = await getEntranceFee();
                console.log("entrancefee", entranceFee);
            }
            updateUI();
        }
    }, [getEntranceFee, isWeb3Enabled]);

    return <section></section>;
};

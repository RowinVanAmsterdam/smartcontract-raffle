import { ethers, network } from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30");

module.exports = async ({ getNamedAccounts, deployments }: any) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId: number = network.config.chainId!;
    let vrfCoordinatorV2Mock;
    let vrfCoordinatorV2Address;
    let subscriptionId;

    // Constructor params
    const entranceFee = networkConfig[chainId as keyof typeof networkConfig]["entranceFee"];
    const gasLane = networkConfig[chainId as keyof typeof networkConfig]["gasLane"];
    const callbackGasLimit = networkConfig[chainId as keyof typeof networkConfig]["callbackGasLimit"];
    const interval = networkConfig[chainId as keyof typeof networkConfig]["interval"];

    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT); 
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId as keyof typeof networkConfig]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId as keyof typeof networkConfig]["subscriptionId"];
    }

    const args = [vrfCoordinatorV2Address, entranceFee, gasLane, subscriptionId, callbackGasLimit, interval];
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[chainId as keyof typeof networkConfig].blockConfirmations || 1,
    });

    if(developmentChains.includes(network.name)){
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
    }

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying...");
        await verify(raffle.address, args);
        
    }
    log("------------------------------");
};

module.exports.tags = ["all", "raffle"]; 

import { ethers, network } from "hardhat";
import * as fs from 'fs';

const FRONT_END_ADDRESSES_FILE = "../smartcontract-raffle-webapp/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../smartcontract-raffle-webapp/constants/abi.json";

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front-end...");
        updateContractAddresses();
        updateAbi();
    }
}

const updateContractAddresses = async () => {
    const raffle = await ethers.getContract("Raffle");
    const chainId = network.config.chainId!.toString();
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"));

    if(chainId in currentAddresses) {
        if(!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address);
        }
    } else {
        currentAddresses[chainId] = [raffle.address];
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

const updateAbi = async () => {
    const raffle = await ethers.getContract("Raffle");
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json) as string);




    const chainId = network.config.chainId!.toString();
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"));

    if(chainId in currentAddresses) {
        if(!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address);
        }
    } else {
        currentAddresses[chainId] = [raffle.address];
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tag = ["all", "frontend"];
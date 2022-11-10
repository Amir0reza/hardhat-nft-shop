import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import verify from "../utils/verify"
import {TEST_RATIO, PRICE} from "../helper-input"

const deployTokenSale: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, ethers } = hre
    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()
    log(`The deployer address is: ${deployer}`)

    const chainId = network.config.chainId

    log("Deploying Token Sale Contract and waiting for confirmations...")

    const myERC20 = await ethers.getContract("MyERC20")
    const myERC721 = await ethers.getContract("MyERC721")
    const args = [TEST_RATIO, PRICE, myERC20.address, myERC721.address]
    const tokenSale = await deploy("TokenSale", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: 1,
    })

    log(`Token Sale Contract deployed at ${tokenSale.address}`)
    log("__________________________________________________")

    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        // verify the code
        await verify(tokenSale.address, args)
    }
}

export default deployTokenSale
deployTokenSale.tags = ["all", "tokenSale"]

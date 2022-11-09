import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import verify from "../utils/verify"

const deployMyERC721: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()
    log(`The deployer address is: ${deployer}`)

    const chainId = network.config.chainId

    log("Deploying MyERC721 Contract and waiting for confirmations...")

    const args: any = []
    const myERC721 = await deploy("MyERC721", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: 1,
    })

    log(`myERC721 Contract deployed at ${myERC721.address}`)
    log("__________________________________________________")

    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        // verify the code
        await verify(myERC721.address, args)
    }
}

export default deployMyERC721
deployMyERC721.tags = ["all", "myErc721"]

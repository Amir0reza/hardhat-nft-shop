import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import verify from "../utils/verify"

const deployMyERC20: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()
    log(`The deployer address is: ${deployer}`)

    const chainId = network.config.chainId

    log("Deploying MyERC20 Contract and waiting for confirmations...")

    const args: any = []
    const myERC20 = await deploy("MyERC20", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: 1,
    })

    log(`MyERC20 Contract deployed at ${myERC20.address}`)
    log("__________________________________________________")

    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        // verify the code
        await verify(myERC20.address, args)
    }
}

export default deployMyERC20
deployMyERC20.tags = ["all", "myErc20"]

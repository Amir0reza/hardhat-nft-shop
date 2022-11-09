import { assert, expect } from "chai"
import { TEST_RATIO } from "../../deploy/03-deploye-token-sale"
import { deployments, ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { MyERC20 } from "../../typechain-types/contracts/MyERC20"
import { MyERC721 } from "../../typechain-types/contracts/MyERC721"
import { TokenSale } from "../../typechain-types/contracts/TokenSale"

describe("NFT Shop", () => {
    let myERC20: MyERC20,
        myERC721: MyERC721,
        tokenSale: TokenSale,
        deployer: SignerWithAddress,
        acc1: SignerWithAddress

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        acc1 = accounts[1]
        await deployments.fixture(["all"])
        myERC20 = await ethers.getContract("MyERC20")
        myERC721 = await ethers.getContract("MyERC721")
        tokenSale = await ethers.getContract("TokenSale")

        const MINTER_ROLE = await myERC20.MINTER_ROLE()
        await myERC20.grantRole(MINTER_ROLE, tokenSale.address) // give the tokensale contract acces to mint tokens
    })

    describe("When the Shop contract is deployed", async () => {
        it("defines the ratio as provided in parameters", async () => {
            const ratio = await tokenSale.getRatio()
            assert.equal(ratio.toString(), TEST_RATIO)
        })

        it("uses a valid ERC20 as payment token", async () => {
            const paymentTokenAddress = await tokenSale.getPaymentToken()
            const paymentTokenContractFactory = await ethers.getContractFactory(
                "MyERC20"
            )
            const paymentTokenInstance =
                paymentTokenContractFactory.attach(paymentTokenAddress)
            await expect(paymentTokenInstance.balanceOf(acc1.address)).not.to.be
                .reverted
            await expect(paymentTokenInstance.mint(acc1.address, 1000)).not.to
                .be.reverted
            await expect(paymentTokenInstance.totalSupply()).not.to.be.reverted
            await expect(
                paymentTokenInstance.allowance(deployer.address, acc1.address)
            ).not.to.be.reverted
        })
    })

    describe("When a user purchase an ERC20 from the Token contract", async () => {
        const sentEther = ethers.utils.parseEther("1")

        beforeEach(async () => {
            await tokenSale.connect(acc1).buyToken({ value: sentEther })
        })

        it("charges the correct amount of ETH", async () => {
            const tokenSaleBalance = await ethers.provider.getBalance(
                tokenSale.address
            )

            expect(tokenSaleBalance).to.be.eq(sentEther)
        })

        it("gives the correct amount of tokens", async () => {
            const ratio = ethers.BigNumber.from(TEST_RATIO)
            const expectedAmount = (
                await ethers.provider.getBalance(tokenSale.address)
            ).div(ratio)
            const realBalance = await myERC20.balanceOf(acc1.address)
            expect(expectedAmount).to.be.eq(realBalance)
        })
    })

    describe.only("When a user burns an ERC20 at the Token contract", async () => {
        const sentEther = ethers.utils.parseEther("1")
        const amountToBurn = ethers.utils.parseEther("1")
        beforeEach(async () => {
            await tokenSale.connect(acc1).buyToken({ value: sentEther })
            await tokenSale.connect(acc1).sellToken(amountToBurn.toString())
        })

        it("gives the correct amount of ETH", async () => {
            const tokenSaleETHBalance = await ethers.provider.getBalance(
                tokenSale.address
            )
            expect(tokenSaleETHBalance.toString()).to.be.eq("0")
        })

        it("burns the correct amount of tokens", async () => {
            const acc1TokenBalance = await myERC20.balanceOf(acc1.address)
            expect(acc1TokenBalance.toString()).to.be.eq("0")
        })
    })

    describe("When a user purchase a NFT from the Shop contract", async () => {
        it("charges the correct amount of ETH", async () => {
            throw new Error("Not implemented")
        })

        it("updates the owner account correctly", async () => {
            throw new Error("Not implemented")
        })

        it("update the pool account correctly", async () => {
            throw new Error("Not implemented")
        })

        it("favors the pool with the rounding", async () => {
            throw new Error("Not implemented")
        })
    })

    describe("When a user burns their NFT at the Shop contract", async () => {
        it("gives the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented")
        })
        it("updates the pool correctly", async () => {
            throw new Error("Not implemented")
        })
    })

    describe("When the owner withdraw from the Shop contract", async () => {
        it("recovers the right amount of ERC20 tokens", async () => {
            throw new Error("Not implemented")
        })

        it("updates the owner account correctly", async () => {
            throw new Error("Not implemented")
        })
    })
})

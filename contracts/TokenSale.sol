// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IMyERC20 {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;
}

interface IMyERC721 {}

/* Errors */
error EthTransferFailed();

contract TokenSale {
    uint256 private immutable ratio;
    uint256 private immutable price;
    IMyERC20 private immutable paymentToken;
    IMyERC721 private immutable nftContract;

    /* functions */
    constructor(
        uint256 _ratio,
        uint256 _price,
        address _paymentToken,
        address _nftContract
    ) {
        ratio = _ratio;
        price = _price;
        paymentToken = IMyERC20(_paymentToken);
        nftContract = IMyERC721(_nftContract);
    }

    /**
     *  @dev This function will min the MTK Token
     */
    function buyToken() external payable {
        uint256 _mintAmount = msg.value / ratio;
        paymentToken.mint(msg.sender, _mintAmount);
    }

    function sellToken(uint256 _amount) external {
        paymentToken.burnFrom(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: (_amount * ratio)}("");
        if (!sent) revert EthTransferFailed();
    }

    /* view/pure functions */
    function getRatio() public view returns (uint256) {
        return ratio;
    }

    function getPaymentToken() public view returns (address) {
        return address(paymentToken);
    }
}

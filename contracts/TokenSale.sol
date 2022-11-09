// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IMyERC20 {
    function mint(address to, uint256 amount) external;

    function burn(uint256 amount) external;

    function approve(address spender, uint256 amount) external returns (bool);

    function burnFrom(address account, uint256 amount) external;

    function balanceOf(address account) external view returns (uint256);
}

/* Errors */
error EthTransferFailed();
error insufficientBalance();

contract TokenSale {
    uint256 private immutable ratio;
    IMyERC20 private immutable paymentToken;

    /* functions */
    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = IMyERC20(_paymentToken);
    }

    /**
     *  @dev This function will min the MTK Token
     */
    function buyToken() external payable {
        uint256 _mintAmount = msg.value / ratio;
        paymentToken.mint(msg.sender, _mintAmount);
    }

    function sellToken(uint256 _amount) external {
        if (paymentToken.balanceOf(msg.sender) < _amount)
            revert insufficientBalance();

        (bool sent, ) = payable(msg.sender).call{value: (_amount * ratio)}("");
        if (!sent) revert EthTransferFailed();
        paymentToken.burn(_amount);
    }

    /* view/pure functions */
    function getRatio() public view returns (uint256) {
        return ratio;
    }

    function getPaymentToken() public view returns (address) {
        return address(paymentToken);
    }
}

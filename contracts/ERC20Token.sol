// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ERC20Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    // Events from the EIP-20 standard
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10 ** uint256(_decimals);
        balances[msg.sender] = totalSupply;

        emit Transfer(address(0), msg.sender, totalSupply);
    }

    // Returns the balance of a given account
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    // Transfers tokens
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(balances[msg.sender] >= amount, "ERC20: insufficient balance");

        balances[msg.sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // Approves an allowance for token management
    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "ERC20: approve to the zero address");

        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // Transfers tokens using an allowance
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(balances[sender] >= amount, "ERC20: insufficient balance");
        require(allowances[sender][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");

        balances[sender] -= amount;
        balances[recipient] += amount;
        allowances[sender][msg.sender] -= amount;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    // Returns the amount of tokens `spender` is allowed to spend on behalf of `owner`
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }

    // Creates new tokens (minting)
    function mint(address account, uint256 amount) public {
        require(account != address(0), "ERC20: mint to the zero address");

        totalSupply += amount;
        balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    // Burns tokens (destroying them)
    function burn(uint256 amount) public {
        require(balances[msg.sender] >= amount, "ERC20: burn amount exceeds balance");

        totalSupply -= amount;
        balances[msg.sender] -= amount;

        emit Transfer(msg.sender, address(0), amount);
    }
}

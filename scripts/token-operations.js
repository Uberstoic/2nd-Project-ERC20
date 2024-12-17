const hre = require("hardhat");

async function main() {
    const TOKEN_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    
    const token = await hre.ethers.getContractAt("ERC20Token", TOKEN_ADDRESS);
    
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    async function checkBalance(address) {
        const balance = await token.balanceOf(address);
        console.log(`Balance of ${address}: ${hre.ethers.utils.formatEther(balance)} tokens`);
    }

    async function transfer(to, amount) {
        const tx = await token.transfer(to, hre.ethers.parseUnits(amount, 18));
        await tx.wait();
        console.log(`Transferred ${amount} tokens to ${to}`);
    }

    async function approve(spender, amount) {
        const tx = await token.approve(spender, hre.ethers.parseUnits(amount, 18));
        await tx.wait();
        console.log(`Approved ${amount} tokens for ${spender}`);
    }

    async function mint(to, amount) {
        const tx = await token.mint(to, hre.ethers.parseUnits(amount, 18));
        await tx.wait();
        console.log(`Minted ${amount} tokens to ${to}`);
    }

    async function burn(amount) {
        const tx = await token.burn(hre.ethers.parseUnits(amount, 18));
        await tx.wait();
        console.log(`Burned ${amount} tokens`);
    }

    // Example usage:
    try {
        // Check initial balance
        await checkBalance(owner.address);

        // Transfer tokens
        await transfer(addr1.address, "10");

        // Approve tokens
        await approve(addr2.address, "5");

        // Mint tokens (if you have permission)
        await mint(owner.address, "1000");

        // Burn tokens
        await burn("5");

        // Check final balances
        await checkBalance(owner.address);
        await checkBalance(addr1.address);
        
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

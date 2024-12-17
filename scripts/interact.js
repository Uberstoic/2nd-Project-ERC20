const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
    
    // Deploy the contract
    console.log("Deploying Token...");
    const token = await ERC20Token.deploy(
        "Omaewamou",     // name
        "NAN",        // symbol
        18,           // decimals
        1000000      // initial supply (1 million tokens)
    );

    console.log("Token deployed to:", await token.getAddress());

    // Get signers
    const [owner, addr1] = await hre.ethers.getSigners();
    
    // Example of checking balance
    const balance = await token.balanceOf(owner.address);
    console.log("Owner balance:", hre.ethers.utils.formatEther(balance));

    // Example of transfer
    const transferAmount = hre.ethers.parseUnits("100", 18);
    await token.transfer(addr1.address, transferAmount);
    console.log("Transferred 100 tokens to:", addr1.address);

    // Check balances after transfer
    const ownerBalance = await token.balanceOf(owner.address);
    const addr1Balance = await token.balanceOf(addr1.address);
    console.log("Owner balance after transfer:", hre.ethers.utils.formatEther(ownerBalance));
    console.log("Recipient balance after transfer:", hre.ethers.utils.formatEther(addr1Balance));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

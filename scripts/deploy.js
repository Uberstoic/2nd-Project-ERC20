const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with account:", deployer.address);

    const Token = await ethers.getContractFactory("ERC20Token");
    const token = await Token.deploy("Omaewamou", "NAN", 18, 1000000);

    console.log("ERC20Token deployed to:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

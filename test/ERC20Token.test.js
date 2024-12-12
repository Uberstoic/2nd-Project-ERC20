const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ERC20Token", function () {
    let Token, token, owner, addr1, addr2;

    const initialSupply = 1000000;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("ERC20Token");
        token = await Token.deploy("Omaewamou", "NAN", 18, initialSupply);
        console.log("Deployed at:", await token.getAddress());
    });

    it("Should have correct initial parameters", async function () {
        const totalSupply = await token.totalSupply();
        const ownerBalance = await token.balanceOf(owner.address);

        const scaledSupply = ethers.parseUnits(initialSupply.toString(), 18);

        expect(totalSupply).to.equal(scaledSupply);
        expect(ownerBalance).to.equal(scaledSupply);
    });

    it("Should transfer tokens between accounts", async function () {
        const amount = ethers.parseUnits("100", 18);

        await token.transfer(addr1.address, amount);
        const ownerBalance = await token.balanceOf(owner.address);
        const addr1Balance = await token.balanceOf(addr1.address);

        const scaledSupply = ethers.parseUnits(initialSupply.toString(), 18);
        expect(ownerBalance).to.equal(scaledSupply - amount);
        expect(addr1Balance).to.equal(amount);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
        const amount = ethers.parseUnits("1000", 18);
        await expect(token.connect(addr1).transfer(owner.address, amount))
            .to.be.revertedWith("ERC20: insufficient balance");
    });

    it("Should approve tokens for delegated transfer", async function () {
        const amount = ethers.parseUnits("50", 18);
        await token.approve(addr1.address, amount);

        const allowance = await token.allowance(owner.address, addr1.address);
        expect(allowance).to.equal(amount);
    });

    it("Should transfer tokens via transferFrom", async function () {
        const amount = ethers.parseUnits("50", 18);

        await token.approve(addr1.address, amount);
        await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);

        const ownerBalance = await token.balanceOf(owner.address);
        const addr2Balance = await token.balanceOf(addr2.address);
        const remainingAllowance = await token.allowance(owner.address, addr1.address);

        const scaledSupply = ethers.parseUnits(initialSupply.toString(), 18);
        expect(ownerBalance).to.equal(scaledSupply - amount);
        expect(addr2Balance).to.equal(amount);
        expect(remainingAllowance).to.equal(0n);
    });

    it("Should fail when transferFrom exceeds allowance", async function () {
        const amount = ethers.parseUnits("50", 18);

        await token.approve(addr1.address, ethers.parseUnits("10", 18));
        await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, amount))
            .to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("Should mint tokens correctly", async function () {
        const amount = ethers.parseUnits("1000", 18);

        await token.mint(addr1.address, amount);
        const totalSupply = await token.totalSupply();
        const addr1Balance = await token.balanceOf(addr1.address);

        const scaledSupply = ethers.parseUnits(initialSupply.toString(), 18);
        expect(totalSupply).to.equal(scaledSupply + amount);
        expect(addr1Balance).to.equal(amount);
    });

    it("Should burn tokens correctly", async function () {
        const amount = ethers.parseUnits("100", 18);

        await token.burn(amount);
        const totalSupply = await token.totalSupply();
        const ownerBalance = await token.balanceOf(owner.address);

        const scaledSupply = ethers.parseUnits(initialSupply.toString(), 18);
        expect(totalSupply).to.equal(scaledSupply - amount);
        expect(ownerBalance).to.equal(scaledSupply - amount);
    });

    it("Should fail when trying to burn more tokens than owned", async function () {
        const amount = ethers.parseUnits("100", 18);

        await expect(token.connect(addr1).burn(amount))
            .to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
});

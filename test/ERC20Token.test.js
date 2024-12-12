const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ERC20Token", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("ERC20Token");
        token = await Token.deploy("Omaewamou", "NAN", 18, 1000000);
        await token.deployed(); 
        expect(token.address).to.properAddress();
    });
    
    it("Should have correct initial parameters", async function () {
        expect(await token.name()).to.equal("Omaewamou");
        expect(await token.symbol()).to.equal("NAN");
        expect(await token.decimals()).to.equal(18);
        expect(await token.totalSupply()).to.equal(ethers.utils.parseUnits("1000000", 18));
        expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("1000000", 18));
    });    

    it("Should transfer tokens between accounts", async function () {
        const amount = ethers.utils.parseUnits("100", 18);

        await token.transfer(addr1.address, amount);
        expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("999900", 18));
        expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
        const amount = ethers.utils.parseUnits("1000", 18);
        await expect(token.connect(addr1).transfer(owner.address, amount)).to.be.revertedWith("ERC20: insufficient balance");
    });

    it("Should approve tokens for delegated transfer", async function () {
        const amount = ethers.utils.parseUnits("50", 18);
        await token.approve(addr1.address, amount);

        expect(await token.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("Should transfer tokens via transferFrom", async function () {
        const amount = ethers.utils.parseUnits("50", 18);

        await token.approve(addr1.address, amount);
        await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);

        expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("999950", 18));
        expect(await token.balanceOf(addr2.address)).to.equal(amount);
        expect(await token.allowance(owner.address, addr1.address)).to.equal(0);
    });

    it("Should fail when transferFrom exceeds allowance", async function () {
        const amount = ethers.utils.parseUnits("50", 18);

        await token.approve(addr1.address, ethers.utils.parseUnits("10", 18));
        await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, amount)).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("Should mint tokens correctly", async function () {
        const amount = ethers.utils.parseUnits("1000", 18);

        await token.mint(addr1.address, amount);
        expect(await token.totalSupply()).to.equal(ethers.utils.parseUnits("1001000", 18));
        expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should burn tokens correctly", async function () {
        const amount = ethers.utils.parseUnits("100", 18);

        await token.burn(amount);
        expect(await token.totalSupply()).to.equal(ethers.utils.parseUnits("999900", 18));
        expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("999900", 18));
    });

    it("Should fail when trying to burn more tokens than owned", async function () {
        const amount = ethers.utils.parseUnits("100", 18);

        await expect(token.connect(addr1).burn(amount)).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
});

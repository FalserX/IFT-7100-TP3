const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FruitMarketplace", function () {
  let contract, owner, buyer1, buyer2;

  beforeEach(async function () {
    [owner, buyer1, buyer2] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory("FruitMarketplace");
    contract = await Marketplace.deploy();
    await contract.deployed();
  });

  it("Test 1: devrait déployer correctement le contrat", async function () {
    expect(contract.address).to.properAddress;
    expect(contract.address).to.not.equal(ethers.constants.AddressZero);
  });

  it("Test 2: devrait permettre d'ajouter une liste de fruits", async function () {
    await contract.connect(owner).addProduct("Pommes", ethers.utils.parseEther("1.0"), 10);
    const product = await contract.getProduct(1);
    expect(product.name).to.equal("Pommes");
    expect(product.price).to.equal(ethers.utils.parseEther("1.0"));
  });

  it("Test 3: permet à un utilisateur d’acheter un fruit", async function () {
    await contract.addProduct("Bananes", ethers.utils.parseEther("0.5"), 5);
    await contract.connect(buyer1).purchaseProduct(1, 2, {
      value: ethers.utils.parseEther("1.0"),
    });

    const transactions = await contract.getAllTransactions();
    expect(transactions.length).to.equal(1);
    expect(transactions[0].buyer).to.equal(buyer1.address);
    expect(transactions[0].quantity).to.equal(2);
  });

  it("Test 4: met à jour la disponibilité après achat", async function () {
    await contract.addProduct("Poires", ethers.utils.parseEther("1.0"), 3);
    await contract.connect(buyer1).purchaseProduct(1, 2, {
      value: ethers.utils.parseEther("2.0"),
    });

    const product = await contract.getProduct(1);
    expect(product.quantityAvailable).to.equal(1);
  });

  it("Test 5: permet d’évaluer un vendeur", async function () {
    await contract.connect(buyer1).rateSeller(owner.address, 4);
    const avg = await contract.getAverageRating(owner.address);
    expect(avg).to.equal(4);
  });

  it("Test 6: permet de mettre à jour les détails d’un fruit", async function () {
    await contract.addProduct("Cerises", ethers.utils.parseEther("0.8"), 8);
    await contract.updateProduct(1, ethers.utils.parseEther("1.2"), 12);
    const product = await contract.getProduct(1);
    expect(product.price).to.equal(ethers.utils.parseEther("1.2"));
    expect(product.quantityAvailable).to.equal(12);
  });

  it("Test 7: refuse un achat avec des fonds insuffisants", async function () {
    await contract.addProduct("Raisins", ethers.utils.parseEther("2.0"), 5);

    await expect(
      contract.connect(buyer2).purchaseProduct(1, 1, {
        value: ethers.utils.parseEther("1.0"),
      })
    ).to.be.revertedWith("Insufficient funds");

    const product = await contract.getProduct(1);
    expect(product.quantityAvailable).to.equal(5);
  });
});

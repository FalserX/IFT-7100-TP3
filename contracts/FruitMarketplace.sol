// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    uint public productCounter;
    uint public sellerCounter;

    struct Product {
        uint id;
        address payable seller;
        string name;
        uint price;
        uint quantityAvailable;
        bool exists;
    }

    struct Seller {
        address sellerAddress;
        uint totalRating;
        uint ratingCount;
    }

    mapping(uint => Product) public products;
    mapping(address => Seller) public sellers;

    event ProductAdded(uint productId, string name, uint price, uint quantity);
    event ProductPurchased(uint productId, address buyer, uint quantity);
    event SellerRated(address seller, uint rating, address buyer);

    modifier onlySeller(uint productId) {
        require(products[productId].seller == msg.sender, "Not the product seller.");
        _;
    }

    function addProduct(string memory _name, uint _price, uint _quantity) external {
        require(_price > 0 && _quantity > 0, "Price and quantity must be positive.");

        if (sellers[msg.sender].sellerAddress == address(0)) {
            sellers[msg.sender] = Seller(msg.sender, 0, 0);
            sellerCounter++;
        }

        productCounter++;
        products[productCounter] = Product(
            productCounter,
            payable(msg.sender),
            _name,
            _price,
            _quantity,
            true
        );

        emit ProductAdded(productCounter, _name, _price, _quantity);
    }

    function purchaseProduct(uint _productId, uint _quantity) external payable {
        Product storage product = products[_productId];
        require(product.exists, "Product does not exist.");
        require(product.quantityAvailable >= _quantity, "Not enough quantity available.");
        uint totalPrice = product.price * _quantity;
        require(msg.value >= totalPrice, "Insufficient payment.");

        product.quantityAvailable -= _quantity;
        product.seller.transfer(totalPrice);

        // Remboursement si trop payé
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit ProductPurchased(_productId, msg.sender, _quantity);
    }

    function rateSeller(address _seller, uint _rating) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5.");
        require(sellers[_seller].sellerAddress != address(0), "Seller does not exist.");

        sellers[_seller].totalRating += _rating;
        sellers[_seller].ratingCount++;

        emit SellerRated(_seller, _rating, msg.sender);
    }

    function getAverageRating(address _seller) external view returns (uint) {
        Seller storage seller = sellers[_seller];
        if (seller.ratingCount == 0) return 0;
        return seller.totalRating / seller.ratingCount;
    }

    function getProduct(uint _productId) external view returns (
        uint id,
        address seller,
        string memory name,
        uint price,
        uint quantityAvailable
    ) {
        Product storage product = products[_productId];
        return (
            product.id,
            product.seller,
            product.name,
            product.price,
            product.quantityAvailable
        );
    }
}

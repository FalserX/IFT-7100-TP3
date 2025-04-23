// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    uint public productCounter;
    uint public sellerCounter;

    struct Product {
        uint id;
        address payable seller;
        string name;
        string description;
        uint price;
        uint stock;
        bool exists;
    }

    struct Seller {
        address sellerAddress;
        uint totalRating;
        uint ratingCount;
    }
    struct Transaction {
        address buyer;
        uint productId;
        uint quantity;
        uint timestamp;
    }

    Transaction[] public transactions;

    mapping(uint => Product) public products;
    mapping(address => uint[]) private productsByOwner;
    mapping(address => Seller) public sellers;

    event ProductAdded(uint productId, string name, uint price, uint stock);
    event ProductPurchased(uint productId, address buyer, uint stock);
    event SellerRated(address seller, uint rating, address buyer);
    event ProductRemoved(uint productId);

    modifier onlySeller(uint productId) {
        require(
            products[productId].seller == msg.sender,
            "Not the product seller."
        );
        _;
    }

    function addProduct(
        string memory _name,
        string memory _description,
        uint _price,
        uint _stock
    ) external {
        require(_price > 0 && _stock > 0, "Price and stock must be positive.");

        if (sellers[msg.sender].sellerAddress == address(0)) {
            sellers[msg.sender] = Seller(msg.sender, 0, 0);
            sellerCounter++;
        }

        productCounter++;
        products[productCounter] = Product(
            productCounter,
            payable(msg.sender),
            _name,
            _description,
            _price,
            _stock,
            true
        );
        productsByOwner[msg.sender].push(productCounter);

        emit ProductAdded(productCounter, _name, _price, _stock);
    }

    function updateProduct(
        uint _productId,
        string memory _newName,
        string memory _newDescription,
        uint _newPrice,
        uint _newStock,
        bool _exists
    ) external onlySeller(_productId) {
        require(_newPrice > 0 && _newStock > 0, "Invalid product details.");
        Product storage product = products[_productId];
        product.price = _newPrice;
        product.name = _newName;
        product.description = _newDescription;
        product.stock = _newStock;
        product.exists = _exists;
    }

    function purchaseProduct(uint _productId, uint _quantity) external payable {
        Product storage product = products[_productId];
        require(product.exists, "Product does not exist.");
        require(product.stock >= _quantity, "Not enough quantity available.");
        uint totalPrice = product.price * _quantity;
        require(msg.value >= totalPrice, "Insufficient payment.");

        product.stock -= _quantity;
        transactions.push(
            Transaction(msg.sender, _productId, _quantity, block.timestamp)
        );

        product.seller.transfer(totalPrice);

        // Remboursement si trop payé
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit ProductPurchased(_productId, msg.sender, _quantity);
    }

    function rateSeller(address _seller, uint _rating) external {
        require(
            _rating >= 1 && _rating <= 5,
            "Rating must be between 1 and 5."
        );
        require(
            sellers[_seller].sellerAddress != address(0),
            "Seller does not exist."
        );

        sellers[_seller].totalRating += _rating;
        sellers[_seller].ratingCount++;

        emit SellerRated(_seller, _rating, msg.sender);
    }

    function getAverageRating(address _seller) external view returns (uint) {
        Seller storage seller = sellers[_seller];
        if (seller.ratingCount == 0) return 0;
        return seller.totalRating / seller.ratingCount;
    }

    function removeProduct(uint _productId) external onlySeller(_productId) {
        // Accède au produit directement via la mapping
        Product storage product = products[_productId];

        require(product.exists, "Product does not exist.");

        // Marque le produit comme inexistant
        product.exists = false;

        // Supprime l'ID du produit de la liste des produits du vendeur
        uint[] storage productList = productsByOwner[msg.sender];
        for (uint i = 0; i < productList.length; i++) {
            if (productList[i] == _productId) {
                // Déplace le dernier produit à la place du produit à supprimer
                productList[i] = productList[productList.length - 1];
                productList.pop(); // Supprime le dernier élément
                break;
            }
        }

        emit ProductRemoved(_productId);
    }

    function getProduct(
        uint _productId
    )
        external
        view
        returns (
            uint id,
            address seller,
            string memory name,
            string memory description,
            uint price,
            uint stock
        )
    {
        Product storage product = products[_productId];
        return (
            product.id,
            product.seller,
            product.name,
            product.description,
            product.price,
            product.stock
        );
    }

    function getAllProducts() external view returns (Product[] memory) {
        uint count = 0;
        uint validCount = 0;
        for (uint i = 1; i <= productCounter; i++) {
            if (products[i].exists) {
                validCount++;
            }
        }
        require(validCount > 0, "No products available.");
        Product[] memory result = new Product[](validCount);
        for (uint i = 1; i <= productCounter; i++) {
            if (products[i].exists) {
                result[count] = products[i];
                count++;
            }
        }

        return result;
    }

    function getAllProductsByOwner(
        address owner
    ) external view returns (Product[] memory) {
        uint[] storage ids = productsByOwner[owner];
        uint validCount = 0;
        for (uint i = 1; i <= ids.length; i++) {
            if (products[i].exists) {
                validCount++;
            }
        }
        require(validCount > 0, "No products available for the owner.");
        Product[] memory result = new Product[](validCount);
        uint count = 0;
        for (uint i = 0; i < ids.length; i++) {
            if (products[ids[i]].exists) {
                result[count] = products[ids[i]];
                count++;
            }
        }
        return result;
    }

    function getAllTransactions() external view returns (Transaction[] memory) {
        return transactions;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    bool private _locked;
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

    struct SellerInfo {
        uint totalAmount;
        bool exists;
    }

    Transaction[] public transactions;

    mapping(uint => Product) public products;
    mapping(address => uint[]) public transactionsByBuyer;
    mapping(address => uint[]) private productsByOwner;
    mapping(address => Seller) public sellers;
    mapping(address => SellerInfo) private sellerPayments;

    event ProductAdded(
        uint productId,
        string name,
        string description,
        uint price,
        uint stock
    );
    event ProductPurchased(
        uint productId,
        address buyer,
        address seller,
        uint stock
    );
    event SellerRated(address seller, uint rating, address buyer);
    event ProductRemoved(uint productId);

    modifier onlySeller(uint productId) {
        require(
            products[productId].seller == msg.sender,
            "Not the product seller."
        );
        _;
    }

    modifier protectReentrancy() {
        require(!_locked, "Reentrancy detected");
        _locked = true;
        _;
        _locked = false;
    }

    modifier productsExists(uint _productId) {
        require(products[_productId].exists, "Product doesn't exist");
        _;
    }

    function addProduct(
        string memory _name,
        string memory _description,
        uint _price,
        uint _stock
    ) external protectReentrancy {
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

        emit ProductAdded(productCounter, _name, _description, _price, _stock);
    }

    function updateProduct(
        uint _productId,
        string memory _newName,
        string memory _newDescription,
        uint _newPrice,
        uint _newStock,
        bool _exists
    )
        external
        protectReentrancy
        onlySeller(_productId)
        productsExists(_productId)
    {
        require(_newPrice > 0 && _newStock > 0, "Invalid product details.");
        Product storage product = products[_productId];
        product.name = _newName;
        product.description = _newDescription;
        product.price = _newPrice;
        product.stock = _newStock;
        product.exists = _exists;
    }

    function purchaseProduct(
        uint256 _productId,
        uint8 _quantity
    ) public payable protectReentrancy productsExists(_productId) {
        require(
            _quantity > 0 &&
                products[_productId].stock > 0 &&
                products[_productId].stock >= _quantity,
            "Invalid quantity or insufficient stock"
        );

        uint256 totalPrice = products[_productId].price * _quantity;
        require(msg.value >= totalPrice, "Insufficient funds provided");

        // Update stock first
        products[_productId].stock -= _quantity;

        // Transfer funds to seller
        (bool sent, ) = products[_productId].seller.call{value: totalPrice}("");
        require(sent, "Failed to send ETH to seller");

        // Record transaction
        Transaction memory newTx = Transaction({
            buyer: msg.sender,
            productId: _productId,
            quantity: _quantity,
            timestamp: block.timestamp
        });
        transactions.push(newTx);
        transactionsByBuyer[msg.sender].push(transactions.length - 1);

        emit ProductPurchased(
            _productId,
            msg.sender,
            products[_productId].seller,
            _quantity
        );

        // Return excess funds if any
        if (msg.value > totalPrice) {
            (bool refundSent, ) = payable(msg.sender).call{
                value: msg.value - totalPrice
            }("");
            require(refundSent, "Refund failed");
        }
    }

    function purchaseMultipleProducts(
        uint[] calldata productIds,
        uint[] calldata quantities
    ) external payable protectReentrancy {
        require(productIds.length == quantities.length, "Mismatched arrays");
        require(productIds.length > 0, "No products specified");

        uint totalCost = 0;

        // Calculate total cost and validate products
        for (uint i = 0; i < productIds.length; i++) {
            uint id = productIds[i];
            uint qty = quantities[i];
            Product storage p = products[id];

            require(p.exists, "Product doesn't exist");
            require(qty > 0, "Quantity must be positive");
            require(p.stock >= qty, "Insufficient stock");

            uint cost = p.price * qty;
            totalCost += cost;

            // Store payment info for each seller
            if (sellerPayments[p.seller].exists) {
                sellerPayments[p.seller].totalAmount += cost;
            } else {
                sellerPayments[p.seller] = SellerInfo({
                    totalAmount: cost,
                    exists: true
                });
            }
        }

        // Verify payment
        require(msg.value >= totalCost, "Insufficient payment");

        // Update product stocks and record transactions
        for (uint i = 0; i < productIds.length; i++) {
            uint id = productIds[i];
            uint qty = quantities[i];
            Product storage p = products[id];

            // Update stock
            p.stock -= qty;

            // Record transaction
            transactions.push(
                Transaction({
                    buyer: msg.sender,
                    productId: id,
                    quantity: qty,
                    timestamp: block.timestamp
                })
            );
            transactionsByBuyer[msg.sender].push(transactions.length - 1);

            emit ProductPurchased(id, msg.sender, p.seller, qty);
        }

        // Process payments to sellers
        for (uint i = 0; i < productIds.length; i++) {
            address seller = products[productIds[i]].seller;
            if (
                sellerPayments[seller].exists &&
                sellerPayments[seller].totalAmount > 0
            ) {
                uint amount = sellerPayments[seller].totalAmount;
                sellerPayments[seller].totalAmount = 0;
                sellerPayments[seller].exists = false;

                (bool sent, ) = payable(seller).call{value: amount}("");
                require(sent, "Payment to seller failed");
            }
        }

        // Return excess payment
        if (msg.value > totalCost) {
            (bool refundSent, ) = payable(msg.sender).call{
                value: msg.value - totalCost
            }("");
            require(refundSent, "Refund failed");
        }
    }

    function rateSeller(
        address _seller,
        uint _rating
    ) external protectReentrancy {
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

    function removeProduct(
        uint _productId
    )
        external
        protectReentrancy
        onlySeller(_productId)
        productsExists(_productId)
    {
        Product storage product = products[_productId];
        product.exists = false;

        uint[] storage productList = productsByOwner[msg.sender];
        for (uint i = 0; i < productList.length; i++) {
            if (productList[i] == _productId) {
                productList[i] = productList[productList.length - 1];
                productList.pop();
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
        require(products[_productId].exists, "Product doesn't exist");
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
        uint validCount = 0;
        for (uint i = 1; i <= productCounter; i++) {
            if (products[i].exists) {
                validCount++;
            }
        }

        if (validCount == 0) {
            Product[] memory emptyArray = new Product[](0);
            return emptyArray;
        }

        Product[] memory result = new Product[](validCount);
        uint idx = 0;

        for (uint i = 1; i <= productCounter; i++) {
            if (products[i].exists) {
                result[idx] = products[i];
                idx++;
            }
        }

        return result;
    }

    function getAllProductsByOwner(
        address owner
    ) external view returns (Product[] memory) {
        uint[] storage ids = productsByOwner[owner];
        uint validCount = 0;
        for (uint i = 0; i < ids.length; i++) {
            if (products[ids[i]].exists) {
                validCount++;
            }
        }

        if (validCount == 0) {
            Product[] memory emptyArray = new Product[](0);
            return emptyArray;
        }

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

    function getTransactionsByBuyer(
        address _buyer
    ) external view returns (Transaction[] memory) {
        uint[] storage txIndexes = transactionsByBuyer[_buyer];
        Transaction[] memory result = new Transaction[](txIndexes.length);
        for (uint i = 0; i < txIndexes.length; i++) {
            result[i] = transactions[txIndexes[i]];
        }
        return result;
    }
}

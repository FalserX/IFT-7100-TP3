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

    Transaction[] public transactions;

    mapping(uint => Product) public products;
    mapping(address => uint[]) public transactionsByBuyer;
    mapping(address => uint[]) private productsByOwner;
    mapping(address => Seller) public sellers;

    event ProductAdded(
        uint productId,
        string name,
        string description,
        uint price,
        uint stock
    );
    event ProductPurchased(uint productId, address buyer, uint stock);
    event SellerRated(address seller, uint rating, address buyer);
    event ProductRemoved(uint productId);

    modifier onlySeller(uint productId) {
        //On s'assure que seul le vendeur peut accéder à certains paramètres d'un produit (nécessaire pour l'ajout, la modification, ou le retrait)
        require(
            products[productId].seller == msg.sender,
            "Not the product seller."
        );
        _;
    }
    modifier protectReentrancy() {
        // Prévient les attaques de rejeu (réentrer) dans les appels (principalement pour l'ajout, modification, retrait et l'achat de produits)
        require(!_locked, "Reentrancy detected");
        _locked = true;
        _;
        _locked = false;
    }
    modifier productsExists(uint _productId) {
        // Permets de fournir un préfiltrage des produits qui ont étés retirées
        require(products[_productId].exists, "Product doesn't exist");
        _;
    }

    function addProduct(
        string memory _name,
        string memory _description,
        uint _price,
        uint _stock
    ) external protectReentrancy {
        //On effectue l'ajout d'un produit par son vendeur, afin de le mettre en vente via la plateforme applicative sur le réseau
        require(_price > 0 && _stock > 0, "Price and stock must be positive.");

        //On valide l'existence du vendeur, autrement on l'ajoute comme vendeur (l'adresse de réception)
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
        //Fournit un tableau des produits filtrés par leur propriétaire
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
        //Permets la mise à jour d'un produit par son propriétaire.
        //On valide que le nouveau prix et le nouveau stock soit plus que 0 afin d'en permettre la vente
        require(_newPrice > 0 && _newStock > 0, "Invalid product details.");
        Product storage product = products[_productId];
        product.price = _newPrice;
        product.name = _newName;
        product.description = _newDescription;
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
                products[_productId].stock >= _quantity
        );
        //Permets d'acheter un produit
        // Calculer le prix total de la transaction
        uint256 totalPrice = products[_productId].price * _quantity;

        // S'assurer que les fonds de l'acheteur sont suffisants.
        require(
            msg.value >= totalPrice,
            "Insufficient or excess funds provided"
        );

        //Mettre à jour le stock seulement après le transfert du montant au vendeur
        products[_productId].stock -= _quantity;

        //Transfert du prix d'achat de l'acheteur vers le vendeur par un appel externe
        (bool sent, ) = (products[_productId].seller).call{value: totalPrice}(
            ""
        );
        //Valide la transmission du montant
        require(sent, "Failed to sent ETH to seller");
        //Ajout de la transaction à la liste des transactions du bloc ETH.
        Transaction memory newTx = Transaction({
            buyer: msg.sender,
            productId: _productId,
            quantity: _quantity,
            timestamp: block.timestamp
        });
        transactions.push(newTx);
        //Ajout de la transaction dans le bloc filtré des transactions effectués par des acheteurs
        transactionsByBuyer[msg.sender].push(transactions.length - 1);
        emit ProductPurchased(_productId, msg.sender, _quantity);
    }

    function purchaseMultipleProducts(
        uint[] calldata productIds,
        uint[] calldata quantities
    ) external payable protectReentrancy {
        //Fonction permettant l'achat de multiples produits
        require(productIds.length == quantities.length, "Mismatched arrays");
        uint totalCost = 0;
        // Use a local mapping to track payments for sellers
        address[] memory sellersCurrent = new address[](productIds.length);
        uint[] memory sellerTotals = new uint[](productIds.length);
        uint sellerCount = 0;

        for (uint i = 0; i < productIds.length; i++) {
            uint id = productIds[i];
            uint qty = quantities[i];
            Product storage p = products[id];

            require(p.exists, "Product removed");
            require(p.stock >= qty, "Not enough stock");
            uint cost = p.price * qty;
            totalCost += cost;
            p.stock -= qty;
            address seller = p.seller;
            bool found = false;
            for (uint j = 0; j < sellerCount; j++) {
                if (sellersCurrent[j] == seller) {
                    sellerTotals[j] += cost;
                    found = true;
                    break;
                }
            }
            if (!found) {
                sellersCurrent[sellerCount] = seller;
                sellerTotals[sellerCount] = cost;
                sellerCount++;
            }

            Transaction memory newTx = Transaction({
                buyer: msg.sender,
                productId: id,
                quantity: qty,
                timestamp: block.timestamp
            });

            transactions.push(newTx);
            transactionsByBuyer[msg.sender].push(transactions.length - 1);

            emit ProductPurchased(id, msg.sender, qty);
        }
        require(msg.value >= totalCost, "Insufficient Payment");
        for (uint i = 0; i < sellerCount; i++) {
            (bool sent, ) = payable(sellersCurrent[i]).call{
                value: sellerTotals[i]
            }("");
            require(sent, "Payment to seller failed");
        }
        //Retour (remboursement du trop perçu)
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
        //Fonction permettant d'évaluer un vendeur.
        //Limitation de l'évaluation entre 1 et 5 compris.
        require(
            _rating >= 1 && _rating <= 5,
            "Rating must be between 1 and 5."
        );
        //On valide l'existence du vendeur
        require(
            sellers[_seller].sellerAddress != address(0),
            "Seller does not exist."
        );

        sellers[_seller].totalRating += _rating;
        sellers[_seller].ratingCount++;

        emit SellerRated(_seller, _rating, msg.sender);
    }

    function getAverageRating(address _seller) external view returns (uint) {
        //Selon le vendeur, on récupère la moyenne des évaluations de ce dernier.
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
        //Fonction permettant de retirer un produit de la vente.
        // Accède au produit directement via la mapping
        Product storage product = products[_productId];

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
            //Fonction permettant d'obtenir un produit selon son identification
            uint id,
            address seller,
            string memory name,
            string memory description,
            uint price,
            uint stock
        )
    {
        //On s'assure que le produit existe avant de le retourner
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
        //Fonction permettant d'obtenir tous les produits en vente.
        uint validCount = 0;
        for (uint i = 1; i <= productCounter; i++) {
            //On valide l'existence du produit en cours
            if (products[i].exists) {
                validCount++;
            }
        }
        //On valide et vérifie qu'il existe des produits en vente
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
        //Permets d'obtenir les produits en ventes pour un propriétaire spécifique selon son adresse
        uint[] storage ids = productsByOwner[owner];
        uint validCount = 0;
        for (uint i = 0; i < ids.length; i++) {
            //On valide l'existence du produit en vente.
            if (products[ids[i]].exists) {
                validCount++;
            }
        }
        //On vérifie et valide la liste des produits en vente, s'il en existe et non vide
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
        //Fonction permettant de retourner toutes les transactions effectuées sur l'application
        return transactions;
    }

    function getTransactionsByBuyer(
        address _buyer
    ) external view returns (Transaction[] memory) {
        //Fonction permettant de retourner toutes les transactions effectuées sur l'application selon l'acheteur (adresse)
        uint[] storage txIndexes = transactionsByBuyer[_buyer];
        Transaction[] memory result = new Transaction[](txIndexes.length);
        for (uint i = 0; i < txIndexes.length; i++) {
            result[i] = transactions[txIndexes[i]];
        }
        return result;
    }
}

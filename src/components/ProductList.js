'use client'

import React, { useEffect, useState } from "react";
import { getContract } from "../services/MarketplaceService";


const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const contract = await getContract();
                const all = await contract.getAllProducts();
                setProducts(all);
            } catch (error) {
                console.error("Erreur chargement produits:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Produits disponibles</h2>
            {products.map((p, idx) => (
                <div key={idx}>
                    <h3>{p.name}</h3>
                    <p>Prix : {ethers.formatEther(p.price)} ETH</p>
                    <p>Quantite disponible : {p.quantityAvailable.toString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;

"use client";

import React, { useState } from "react";
import { getContract } from "../services/MarketplaceService";
import { ethers } from "ethers";

const PurchaseProductForm = () => {
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [message, setMessage] = useState("");

    const handlePurchase = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const contract = await getContract();
            const totalPrice = ethers.parseEther((Number(pricePerUnit) * Number(quantity)).toFixed(18));

            const tx = await contract.purchaseProduct(parseInt(productId), parseInt(quantity), {
                value: totalPrice,
            });

            await tx.wait();
            setMessage("Achat réussi !");

            setProductId("");
            setQuantity("");
            setPricePerUnit("");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'achat.");
        }
    };

    return (
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginTop: "2rem" }}>
            <h2>Acheter un produit</h2>
            <form onSubmit={handlePurchase}>
                <div>
                    <label>ID du produit :</label><br />
                    <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} required />
                </div>
                <div>
                    <label>Quantité :</label><br />
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
                <div>
                    <label>Prix unitaire (ETH) :</label><br />
                    <input type="number" step="0.01" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: "1rem" }}>Acheter</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PurchaseProductForm;

"use client";

import React, { useState } from "react";
import { getContract } from "../services/MarketplaceService";
import { ethers } from "ethers";

const AddProductForm = () => {
    const [name, setName] = useState("");
    const [priceEth, setPriceEth] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const contract = await getContract();
            const priceWei = ethers.parseEther(priceEth);

            const tx = await contract.addProduct(name, priceWei, parseInt(quantity));
            await tx.wait();

            setMessage("Produit ajouté avec succès !");
            setName("");
            setPriceEth("");
            setQuantity("");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l’ajout du produit.");
        }
    };

    return (
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>Vendre un produit</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom :</label><br />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Prix (en ETH) :</label><br />
                    <input type="number" step="0.01" value={priceEth} onChange={(e) => setPriceEth(e.target.value)} required />
                </div>
                <div>
                    <label>Quantité :</label><br />
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: "1rem" }}>Ajouter</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddProductForm;

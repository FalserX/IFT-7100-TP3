"use client";

import React, { useState } from "react";
import { getContract } from "../services/MarketplaceService";

const UpdateProductForm = () => {
    const [productId, setProductId] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [message, setMessage] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const contract = await getContract();
            const tx = await contract.updateProduct(
                parseInt(productId),
                ethers.parseEther(newPrice),
                parseInt(newQuantity)
            );
            await tx.wait();

            setMessage("Fruit modifié avec succès !");
            setProductId("");
            setNewPrice("");
            setNewQuantity("");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de la mise à jour.");
        }
    };

    return (
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginTop: "2rem" }}>
            <h2>Modifier un fruit existant</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>ID du fruit :</label><br />
                    <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} required />
                </div>
                <div>
                    <label>Nouveau prix (ETH) :</label><br />
                    <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
                </div>
                <div>
                    <label>Nouvelle quantité :</label><br />
                    <input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: "1rem" }}>Mettre à jour</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateProductForm;

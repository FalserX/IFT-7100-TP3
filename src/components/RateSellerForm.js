"use client";

import React, { useState } from "react";
import { getContract } from "../services/MarketplaceService";

const RateSellerForm = () => {
    const [sellerAddress, setSellerAddress] = useState("");
    const [rating, setRating] = useState("");
    const [message, setMessage] = useState("");

    const handleRate = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const contract = await getContract();
            const tx = await contract.rateSeller(sellerAddress, parseInt(rating));
            await tx.wait();

            setMessage("Évaluation soumise avec succès !");
            setSellerAddress("");
            setRating("");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'évaluation.");
        }
    };

    return (
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginTop: "2rem" }}>
            <h2>Évaluer un vendeur</h2>
            <form onSubmit={handleRate}>
                <div>
                    <label>Adresse du vendeur :</label><br />
                    <input type="text" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} required />
                </div>
                <div>
                    <label>Note (1 à 5) :</label><br />
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: "1rem" }}>Envoyer</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RateSellerForm;

import abi from "./Marketplace.json"; // Copie-colle ici l'ABI complète compilée (dans artifacts)

export const contractABI = abi.abi;
export const contractAddress = process.env.contractAddress || ""; // Adresse obtenue après le déploiement

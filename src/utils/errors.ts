export enum ErrorCodes {
    NO_PROVIDERS = "Aucun portefeuille n'a pu être trouvé. Aucun provider n'a pu être détecté.",
    CONNECT_ERROR = "Une erreur est survenue lors de la connexion du portefeuille.",
    INSUFFICIENT_FUNDS = "Les fonds sont insuffisants pour compléter la transaction.",
    WALLET_ADDRESS_ERROR = "Une erreur est survenue lors de la récupération de l'adresse du portefeuille.",
    WALLET_SIGNER_ERROR = "Une erreur est survenue lors de la récupération du propriétaire du portefeuille.",
    WALLET_NO_WINDOW_ERROR = "Aucun portefeuille détecté. Veuillez installé un portefeuille, tel que MetaMask.",
}
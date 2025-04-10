# Projet WEB3_DApp avec Ethereum et React NextJS
Ce projet permet de démontrer l'usage des applications décentralisées avec Ethereum et cela avec des contrats et Hardhat, dans le cadre du cours IFT-7100 Aspects pratiques de la chaine de blocs de l'Université Laval

Voici certaines commandes possibles

### Commandes possibles

__Hardhat native__
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node

__Scripts NPM/YARN__
npm run deploy / yarn deploy --> Effectue le déploiement sur le noeud du réseau test Sepolia (Définit dans les variables d'environnements .env)
npm run dev / yarn dev --> Effectue le lancement du front en mode développement
npm run build / yarn build --> Effectue la compilation du code du front
npm run start-front / yarn start-front --> Effectue le lancement en mode production du front
npm run lint / yarn lint --> Effectue le linter dans le code préparé
npm run test / yarn test --> Effectue le lancement des tests à l'intérieur du code. (Principalement pour hardhat)
npm run start-back / yarn start-back --> Effectue le lancement en mode production du back
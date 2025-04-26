# Projet WEB3_DApp avec Ethereum et React NextJS

Ce projet permet de démontrer l'usage des applications décentralisées avec Ethereum et cela avec des contrats et Hardhat, dans le cadre du cours IFT-7100 Aspects pratiques de la chaine de blocs de l'Université Laval

Voici certaines commandes possibles

### Commandes possibles

**Hardhat native**

```bash
npm install --save-dev hardhat chai ethers
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
npx hardhat
npx hardhat compile
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
```

---

**Scripts NPM/YARN**

Effectue le déploiement sur le noeud du réseau test Sepolia (Définit dans les variables d'environnements .env)

```bash
npm run deploy
```

ou

```bash
yarn deploy
```

Effecue le déploiement sur le noeud en local utilisant hardhat (Définit dans les variables d'environnement .env)

```bash
npm run deploy-local
```

ou

```bash
yarn deploy-local
```

Effectue le lancement du front en mode développement

```bash
npm run dev
```

ou

```bash
yarn dev
```

Effectue la compilation du code du front

```bash
npm run build
```

ou

```bash
yarn build
```

Effectue le lancement en mode production du front

```bash
npm run start-front
```

ou

```bash
yarn start-front
```

Effectue le linter dans le code préparé

```bash
npm run lint
```

ou

```bash
yarn lint
```

Effectue le lancement des tests à l'intérieur du code. (Principalement pour hardhat)

```bash
npm run test
```

ou

```bash
yarn test
```

Effectue le lancement en mode production du back

```bash
npm run start-back
```

ou

```bash
yarn start-back
```

Effectue le lancement du node Hardhat en local

```bash
npm run hardhat
```

ou

```bash
yarn hardhat
```

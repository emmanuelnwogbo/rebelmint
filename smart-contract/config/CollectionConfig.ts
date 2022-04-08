import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import { ethereumTestnet, ethereumMainnet } from '../lib/Networks';
import { openSea } from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: ethereumTestnet,
  mainnet: ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'RubbleRebel',
  tokenName: 'The Rebellion Nft',
  tokenSymbol: 'Rebel',
  hiddenMetadataUri: 'ipfs://QmeUDtu3NqxSBXjJ8z3WcHgv2iSSttgpTZTwiYmsfoCsKA/hidden.json',
  maxSupply: 4589,
  whitelistSale: {
    price: 0.04,
    maxMintAmountPerTx: 3,
  },
  preSale: {
    price: 0.04,
    maxMintAmountPerTx: 3,
  },
  publicSale: {
    price: 0.04,
    maxMintAmountPerTx: 3,
  },
  contractAddress: '0xE865DedA843BC49789cD92ED8Efe2D921D1c1E90',
  marketplaceIdentifier: 'RubbleRebelNft',
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;

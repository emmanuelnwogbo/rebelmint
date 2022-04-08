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
  contractName: 'TheRebellion',
  tokenName: 'The Rebellion Nft',
  tokenSymbol: 'Rebel',
  hiddenMetadataUri: 'ipfs://QmUPdk52gg268cb4ApAvJKc9XHihaXMu4NLnQaC5Gdob9m/hidden.json',
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
  contractAddress: '0xC7706E1f73DcD6B76c76627de83739BD5320C633',
  marketplaceIdentifier: 'TheRebellionNft',
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;

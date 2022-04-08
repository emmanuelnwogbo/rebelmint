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
  contractName: 'TheRebellionNFT',
  tokenName: 'The Rebellion NFT',
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
  contractAddress: '0xbf8b8f09eEfdB74cedd461FA0DaF36b5784Dc80a',
  marketplaceIdentifier: 'TheRebellionNFTNft',
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;

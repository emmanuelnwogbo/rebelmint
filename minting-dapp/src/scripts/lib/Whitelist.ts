import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const whitelistAddresses = [
  "_REPLACE_EVERYTHING_WITH_REAL_ADDRESSES___",
  "0xdE6C369AE56e994c918B6dDd1639FA6799Cd35a9",
  "0x12A0e5B66b1CDbeC7718583bddD9Eb385Fd31EE7",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
  "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
  "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
  "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
  "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
  "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
  "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
  "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
  "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
]

export default new class Whitelist {
  private merkleTree!: MerkleTree;

  private getMerkleTree(): MerkleTree
  {
    if (this.merkleTree === undefined) {
      const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
      
      this.merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    }

    return this.merkleTree;
  }

  public getProofForAddress(address: string): string[]
  {
    return this.getMerkleTree().getHexProof(keccak256(address));
  }

  public getRawProofForAddress(address: string): string
  {
    return this.getProofForAddress(address).toString().replaceAll('\'', '').replaceAll(' ', '');
  }

  public contains(address: string): boolean
  {
    return this.getMerkleTree().getLeafIndex(Buffer.from(keccak256(address))) >= 0;
  }
};
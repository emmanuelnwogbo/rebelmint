import React from 'react';
import { ethers, BigNumber } from 'ethers'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';
import NftContractType from '../lib/NftContractType';
import CollectionConfig from '../../../../smart-contract/config/CollectionConfig';
import NetworkConfigInterface from '../../../../smart-contract/lib/NetworkConfigInterface';
import CollectionStatus from './CollectionStatus';
import MintWidget from './MintWidget';
import Whitelist from '../lib/Whitelist';

const ContractAbi = require('../../../../smart-contract/artifacts/contracts/' + CollectionConfig.contractName + '.sol/' + CollectionConfig.contractName + '.json').abi;

interface Props {
}

interface State {
  userAddress: string|null;
  network: ethers.providers.Network|null,
  networkConfig: NetworkConfigInterface,
  totalSupply: number;
  maxSupply: number;
  maxMintAmountPerTx: number;
  tokenPrice: BigNumber;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  merkleProofManualAddress: string;
  merkleProofManualAddressFeedbackMessage: string|JSX.Element|null;
  errorMessage: string|JSX.Element|null,
  time: String
}

const defaultState: State = {
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.mainnet,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isPaused: true,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  merkleProofManualAddress: '',
  merkleProofManualAddressFeedbackMessage: null,
  errorMessage: null,
  time: ''
};

export default class Dapp extends React.Component<Props, State> {
  provider!: Web3Provider;

  contract!: NftContractType;

  private merkleProofManualAddressInput!: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount = async () => {
    const browserProvider = await detectEthereumProvider() as ExternalProvider;

    this.timer();

    if (browserProvider?.isMetaMask !== true) {
      
      /*this.setError( 
        <>
          <div>Metamask not detected</div>
        </>,
      );*/
    }

    this.provider = new ethers.providers.Web3Provider(browserProvider);

    this.registerWalletEvents(browserProvider);

    //await this.initWallet();
  }

  private timer(): void 
  {
    var countDownDate = new Date("Apr 10, 2022 12:0:0").getTime();

    // Update the count down every 1 second
    var x = setInterval(() => {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    let calculatedTime;
    calculatedTime = days + " day  " + hours + " hrs  "
    + minutes + " mins  " + seconds + " secs  ";

    console.log(calculatedTime);
    this.setState({
      time: calculatedTime
    });

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
    }

    return;
    }, 1000);
  }

  async mintTokens(amount: number): Promise<void>
  {
    try {
      await this.contract.mint(amount, {value: this.state.tokenPrice.mul(amount)});
    } catch (e) {
      this.setError(e);
    }
  }

  async whitelistMintTokens(amount: number): Promise<void>
  {
    try {
      await this.contract.whitelistMint(amount, Whitelist.getProofForAddress(this.state.userAddress!), {value: this.state.tokenPrice.mul(amount)});
    } catch (e) {
      this.setError('Address has already claimed whitelist. Please wait for public sale');
    }
  }

  private isWalletConnected(): boolean
  {
    return this.state.userAddress !== null;
  }

  private isContractReady(): boolean
  {
    return this.contract !== undefined;
  }

  private isSoldOut(): boolean
  {
    return this.state.maxSupply !== 0 && this.state.totalSupply < this.state.maxSupply;
  }

  private isNotMainnet(): boolean
  {
    return this.state.network !== null && this.state.network.chainId !== CollectionConfig.mainnet.chainId;
  }

  private copyMerkleProofToClipboard(): void
  {
    const merkleProof = Whitelist.getRawProofForAddress(this.state.userAddress ?? this.state.merkleProofManualAddress);

    if (merkleProof.length < 1) {
      this.setState({
        merkleProofManualAddressFeedbackMessage: 'The given address is not in the whitelist, please double-check.',
      });

      return;
    }

    navigator.clipboard.writeText(merkleProof);

    this.setState({
      merkleProofManualAddressFeedbackMessage: 
      <>
        <strong>Congratulations!</strong> <span className="emoji">🎉</span><br />
        Your Merkle Proof <strong>has been copied to the clipboard</strong>. You can paste it into <a href={this.generateContractUrl()} target="_blank">{this.state.networkConfig.blockExplorer.name}</a> to claim your tokens.
      </>,
    });
  }

  render() {
    return (
      <>
       <div className="dapp">
        <div className="header">
          <div className="header__left">
            <div className="header__left--name">
              <figure className="header__left--figure">
                <img src="/build/images/REBELLION.png" />
              </figure>
            </div>
          </div>
          <div className="header__right">
            <span className="social" onClick={() => window.open("https://discord.gg/wmCcTtXUps")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="52" viewBox="0 0 48 52" fill="none" data-v-379a16a5=""><g filter="url(#filter0_d_15_140)" data-v-379a16a5=""><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#5865F2" data-v-379a16a5=""></path> <path d="M32.8566 15.781C31.1358 15.026 29.2904 14.4697 27.3609 14.1511C27.3257 14.1449 27.2906 14.1603 27.2725 14.191C27.0352 14.5946 26.7723 15.1212 26.5882 15.5351C24.513 15.238 22.4483 15.238 20.4156 15.5351C20.2315 15.112 19.959 14.5946 19.7206 14.191C19.7025 14.1613 19.6674 14.1459 19.6323 14.1511C17.7039 14.4686 15.8585 15.0249 14.1366 15.781C14.1216 15.7872 14.1089 15.7974 14.1004 15.8107C10.6001 20.8112 9.64116 25.6888 10.1116 30.506C10.1137 30.5295 10.1275 30.5521 10.1467 30.5664C12.4561 32.1881 14.6932 33.1727 16.8887 33.8253C16.9238 33.8355 16.9611 33.8232 16.9834 33.7956C17.5028 33.1174 17.9657 32.4023 18.3627 31.6503C18.3861 31.6062 18.3637 31.554 18.3158 31.5366C17.5815 31.2702 16.8823 30.9454 16.2097 30.5766C16.1565 30.5469 16.1522 30.4742 16.2012 30.4393C16.3427 30.3379 16.4843 30.2324 16.6194 30.1258C16.6439 30.1064 16.678 30.1023 16.7067 30.1146C21.1254 32.0437 25.9092 32.0437 30.2758 30.1146C30.3046 30.1013 30.3386 30.1054 30.3642 30.1248C30.4994 30.2314 30.6409 30.3379 30.7835 30.4393C30.8324 30.4742 30.8292 30.5469 30.776 30.5766C30.1034 30.9526 29.4042 31.2702 28.6688 31.5356C28.6209 31.553 28.5997 31.6062 28.6231 31.6503C29.0285 32.4012 29.4915 33.1163 30.0013 33.7945C30.0226 33.8232 30.0608 33.8355 30.096 33.8253C32.3022 33.1727 34.5392 32.1881 36.8486 30.5664C36.8688 30.5521 36.8816 30.5305 36.8837 30.507C37.4467 24.9378 35.9408 20.1002 32.8917 15.8117C32.8843 15.7974 32.8715 15.7872 32.8566 15.781ZM19.0225 27.5728C17.6922 27.5728 16.596 26.4049 16.596 24.9706C16.596 23.5364 17.6709 22.3685 19.0225 22.3685C20.3847 22.3685 21.4703 23.5466 21.449 24.9706C21.449 26.4049 20.3741 27.5728 19.0225 27.5728ZM27.9941 27.5728C26.6638 27.5728 25.5676 26.4049 25.5676 24.9706C25.5676 23.5364 26.6425 22.3685 27.9941 22.3685C29.3563 22.3685 30.4419 23.5466 30.4206 24.9706C30.4206 26.4049 29.3563 27.5728 27.9941 27.5728Z" fill="white" data-v-379a16a5=""></path></g> <defs data-v-379a16a5=""><filter id="filter0_d_15_140" x="-4" y="0" width="56" height="56" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" data-v-379a16a5=""><feFlood flood-opacity="0" result="BackgroundImageFix" data-v-379a16a5=""></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" data-v-379a16a5=""></feColorMatrix> <feOffset dy="4" data-v-379a16a5=""></feOffset> <feGaussianBlur stdDeviation="2" data-v-379a16a5=""></feGaussianBlur> <feComposite in2="hardAlpha" operator="out" data-v-379a16a5=""></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" data-v-379a16a5=""></feColorMatrix> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_140" data-v-379a16a5=""></feBlend> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_140" result="shape" data-v-379a16a5=""></feBlend></filter></defs></svg>
            </span>
            <span className="social" onClick={() => window.open("https://twitter.com/TherebellionNFT")}>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="45" height="45" viewBox="0 0 45 45" fill="none" data-v-379a16a5=""><rect width="45" height="45" fill="url(#pattern0)" data-v-379a16a5=""></rect> <defs data-v-379a16a5=""><pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1" data-v-379a16a5=""><use xlinkHref="#image0_15_143" transform="scale(0.0104167)" data-v-379a16a5=""></use></pattern> <image id="image0_15_143" width="96" height="96" xlinkHref="data:image/png;base64,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" data-v-379a16a5=""></image></defs></svg>
            </span>
          </div>
        </div>
       <div className="jumbotron">
       <div className="dapp__left">
         <div className="dapp__left--midphrase">
          <span className="fff">A community driven brand</span>
          <span className="transparent">4444 hand painted NFTs ready to</span>
          <span className="transparent">take web3 by storm.</span>
         </div>

          <div className="dapp__mint">
          {this.isNotMainnet() ?
          <div className="not-mainnet">
            <span className="small">Current network: <span className="dapp__mint--mainnetlabel">{this.state.network?.name}</span></span>
          </div>
          : <div className="dapp__mint--mainnet">
          <span className="small">{this.state.network ? 'Current network: ' : '' }<span className="dapp__mint--mainnetlabel">{this.state.network?.name === 'homestead' ? 'mainnet' : ''}</span></span>
        </div>}

        {this.state.errorMessage ? <div className="error"><p>{this.state.errorMessage}</p><button className="close" onClick={() => this.setError()}>Close</button></div> : null}
        
        {this.isWalletConnected() ?
          <>
            {this.isContractReady() ?
              <>
                <CollectionStatus
                  userAddress={this.state.userAddress}
                  maxSupply={this.state.maxSupply}
                  totalSupply={this.state.totalSupply}
                  isPaused={this.state.isPaused}
                  isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                  isUserInWhitelist={this.state.isUserInWhitelist}
                />
                {this.state.totalSupply < this.state.maxSupply ?
                  <MintWidget
                    maxSupply={this.state.maxSupply}
                    totalSupply={this.state.totalSupply}
                    tokenPrice={this.state.tokenPrice}
                    maxMintAmountPerTx={this.state.maxMintAmountPerTx}
                    isPaused={this.state.isPaused}
                    isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                    isUserInWhitelist={this.state.isUserInWhitelist}
                    mintTokens={(mintAmount) => this.mintTokens(mintAmount)}
                    whitelistMintTokens={(mintAmount) => this.whitelistMintTokens(mintAmount)}
                  />
                  :
                  <div className="collection-sold-out">
                    <h2>Tokens have been <strong>sold out</strong>! <span className="emoji">🥳</span></h2>

                    You can buy from our beloved holders on <a href={this.generateMarketplaceUrl()} target="_blank">{CollectionConfig.marketplaceConfig.name}</a>.
                  </div>
                }
              </>
              :
              <div className="collection-not-ready">
                Loading Rebellion data...
              </div>
            }
          </>
        : null}

        {!this.isWalletConnected() || !this.isSoldOut() ?
          <div className="no-wallet">
            <div className="timer-div"><span>Count down to Mint: </span><span className="countdown-timer">{ this.state.time }</span></div>
            {/*!this.isWalletConnected() ? <button className="primary connect" disabled={this.provider === undefined} onClick={() => this.connectWallet()}>Connect Wallet</button> : null*/}
          </div>
          : null}
          </div>

       </div>
       <div className="dapp__right">
          <div className="dapp__right--imgs">
          <figure>
            <img src="/build/images/male--character-237.png" />
          </figure>
          </div>
       </div>
       </div>
       </div>
      </>
    );
  }

  private setError(error: any = null): void
  {
    let errorMessage = 'Unknown error...';

    if (null === error || typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object') {
      // Support any type of error from the Web3 Provider...
      if (error?.error?.message !== undefined) {
        errorMessage = error.error.message;
      } else if (error?.data?.message !== undefined) {
        errorMessage = error.data.message;
      } else if (error?.message !== undefined) {
        errorMessage = error.message;
      } else if (React.isValidElement(error)) {
        this.setState({errorMessage: error});
  
        return;
      }
    }

    this.setState({
      errorMessage: null === errorMessage ? null : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    });
  }

  private generateContractUrl(): string
  {
    return this.state.networkConfig.blockExplorer.generateContractUrl(CollectionConfig.contractAddress!);
  }

  private generateMarketplaceUrl(): string
  {
    return CollectionConfig.marketplaceConfig.generateCollectionUrl(CollectionConfig.marketplaceIdentifier, !this.isNotMainnet());
  }

  private async connectWallet(): Promise<void>
  {
    try {
      await this.provider.provider.request!({ method: 'eth_requestAccounts' });

      this.initWallet();
    } catch (e) {
      this.setError(e);
    }
  }

  private async initWallet(): Promise<void>
  {
    const walletAccounts = await this.provider.listAccounts();
    
    this.setState(defaultState);

    if (walletAccounts.length === 0) {
      return;
    }

    const network = await this.provider.getNetwork();
    let networkConfig: NetworkConfigInterface;

    if (network.chainId === CollectionConfig.mainnet.chainId) {
      networkConfig = CollectionConfig.mainnet;
    } else if (network.chainId === CollectionConfig.testnet.chainId) {
      networkConfig = CollectionConfig.testnet;
    } else {
      this.setError('Unsupported network!');

      return;
    }
    
    this.setState({
      userAddress: walletAccounts[0],
      network,
      networkConfig,
    });

    if (await this.provider.getCode(CollectionConfig.contractAddress!) === '0x') {
      this.setError('Could not find the contract, are you connected to the right chain?');

      return;
    }

    this.contract = new ethers.Contract(
      CollectionConfig.contractAddress!,
      ContractAbi,
      this.provider.getSigner(),
    ) as NftContractType;

    this.setState({
      maxSupply: (await this.contract.maxSupply()).toNumber(),
      totalSupply: (await this.contract.totalSupply()).toNumber(),
      maxMintAmountPerTx: (await this.contract.maxMintAmountPerTx()).toNumber(),
      tokenPrice: await this.contract.cost(),
      isPaused: await this.contract.paused(),
      isWhitelistMintEnabled: await this.contract.whitelistMintEnabled(),
      isUserInWhitelist: Whitelist.contains(this.state.userAddress ?? ''),
    });
  }

  private registerWalletEvents(browserProvider: ExternalProvider): void
  {
    // @ts-ignore
    browserProvider.on('accountsChanged', () => {
      this.initWallet();
    });

    // @ts-ignore
    browserProvider.on('chainChanged', () => {
      window.location.reload();
    });
  }
}

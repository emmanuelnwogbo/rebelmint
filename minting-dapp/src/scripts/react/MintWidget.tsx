import { utils, BigNumber } from 'ethers';
import React from 'react';

interface Props {
  maxSupply: number,
  totalSupply: number,
  tokenPrice: BigNumber,
  maxMintAmountPerTx: number,
  isPaused: boolean,
  isWhitelistMintEnabled: boolean,
  isUserInWhitelist: boolean,
  mintTokens(mintAmount: number): Promise<void>,
  whitelistMintTokens(mintAmount: number): Promise<void>,
}

interface State {
  mintAmount: number;
  time: String
}

const defaultState: State = {
  mintAmount: 1,
  time: '',
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount = async () => {
    
  }

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private incrementMintAmount(): void {
    this.setState({
      mintAmount: Math.min(this.props.maxMintAmountPerTx, this.state.mintAmount + 1),
    });
  }

  private decrementMintAmount(): void {
    this.setState({
      mintAmount: Math.max(1, this.state.mintAmount - 1),
    });
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(this.state.mintAmount);

      return;
    }

    await this.props.whitelistMintTokens(this.state.mintAmount);
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
    calculatedTime = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";

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

  render() {
    return (
      <>
        {this.canMint() ?
          <div className="mint-widget">

            <div className="price">
              <strong>Minting Price:</strong> {utils.formatEther(this.props.tokenPrice.mul(this.state.mintAmount))} ETH
            </div>

            <div className="controls">
             <div className="controls-arit">
                <button className="decrease arit" onClick={() => this.decrementMintAmount()}>-</button>
                <span className="mint-amount">{this.state.mintAmount} {this.state.mintAmount > 1 ? 'Rebels' : 'Rebel'}</span>
                <button className="increase arit" onClick={() => this.incrementMintAmount()}>+</button>
              </div> 
              <button className="primary mint" onClick={() => this.mint()}>Mint</button>
            </div>
          </div>
          :
          <div className="cannot-mint">
            
            {this.props.isWhitelistMintEnabled ? <>You are not included in the <strong>whitelist</strong>.</> :<>Count down to Presale.</>} { this.state.time }<br />
          </div>
        }
      </>
    );
  }
}

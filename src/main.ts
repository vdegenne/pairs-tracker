import { LitElement, html, css, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { live } from 'lit/directives/live.js'
import '@material/mwc-snackbar'
import '@material/mwc-button'
// import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-textarea'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import { Dialog } from '@material/mwc-dialog'
import ms from 'ms'
import { timeAgo } from './time-ago'
import { TextField } from '@material/mwc-textfield'
import { TextArea } from '@material/mwc-textarea'
import './pair-information'
import { openCoinMarketCap, openCryptowatch } from './util'
import '@vdegenne/my-footer-element'

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

export declare type Pair = {
  pair: string,
  checkInValue?: string,
  checkIn?: number,
  note: string,
  checked: boolean
}

@customElement('app-container')
export class AppContainer extends LitElement {

  private pairs: Pair[] = [];
  @state()
  private pair?: Pair; // selected pair

  @query('mwc-dialog') dialog!: Dialog;

  static styles = css`
  mwc-textfield, mwc-textarea {
    width: 100%;
    margin: 12px 0;
  }

  .pair {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    background-color: white;
    padding: 0 12px 0 0;
    margin: 4px;
    border-radius: 6px;
  }

  my-footer-element {
    position: fixed;
    bottom: 0;
  }
  `

  constructor () {
    super()
    this.loadInformation()
  }

  render () {
    return html`
    <header>
      <img src="./img/icon.png" width=68 style="margin-left:8px" title="Pairs Tracker">
    </header>

    <div style="max-width:500px;margin:0 auto;">
    ${this.pairs.map(p => {
      return html`
      <div class="pair" style="text-decoration:${p.checked ? 'line-through' : 'none'};opacity:${p.checked ? '0.5' : '1'}"
        @click=${() => window.pairInformation.open(p)}>
        <div style="display:flex;align-items:center">
          <mwc-checkbox ?checked=${p.checked}
            @click=${e => e.stopPropagation()}
            @change=${(e) => { p.checked = e.target.checked; this.requestUpdate(); this.saveInformation() }}></mwc-checkbox>
          <span style="min-width:100px">${p.pair}</span>
          <mwc-icon-button
            @click=${(e) => { e.stopPropagation(); openCoinMarketCap(p) }}>
            <img src="./img/coinmarketcap.ico">
          </mwc-icon-button>
          <mwc-icon-button
            @click=${(e) => { e.stopPropagation(); openCryptowatch(p) }}>
            <img src="./img/cryptowatch.png">
          </mwc-icon-button>
        </div>
        <div>${p.checkIn ? `check ${timeAgo.format(p.checkIn)}` : nothing}</div>
      </div>
      `
    })}
    </div>

    <div style="text-align:center">
      <mwc-button icon=add
      @click=${() => this.addPair()}>pair</mwc-button>
    </div>

    <my-footer-element github="https://github.com/vdegenne/pairs-tracker"
      @copied=${() => window.toast('bitcoin address copied')}></my-footer-element>

    <mwc-dialog heading=${this.pair || 'Add pair'} escapeKeyAction="" scrimClickAction="">
      <mwc-textfield label="pair" value=${this.pair ? this.pair.pair : ''}
        @keyup=${(e) => { if (this.pair && e.target.value) this.pair.pair = e.target.value }}
        helper="if no slash defaults to 'USDT' quote"
        dialogInitialFocus></mwc-textfield>

      <mwc-textfield label="check in" value=${this.pair && this.pair.checkInValue ? this.pair.checkInValue : ''}
        helper="e.g. 1m, 2m, 5h, 3d, ..."
        @keyup=${(e) => this.onCheckInKeyup(e)}
      ></mwc-textfield>

      <mwc-textarea label="note" value=${this.pair ? this.pair.note : ''}
        rows=8></mwc-textarea>


      <mwc-button slot="secondaryAction" dialogAction=close
        @click=${() => this.onDialogDismiss()}>close</mwc-button>
      <mwc-button raised slot="primaryAction"
        @click=${() => this.onDialogAccept()}
        >${this.pair ? 'save' : 'add'}</mwc-button>
    </mwc-dialog>
    `
  }

  private onDialogDismiss() {
    this._reject!()
  }

  $ (selector: string) {
    return this.shadowRoot!.querySelector(selector)
  }

  private onDialogAccept() {
    let pair!: Pair;

    // if (this.pair === undefined) {
      const pairValue = (this.$('mwc-textfield[label=pair]') as TextField).value
      const checkIn = (this.$('mwc-textfield[label="check in"]') as TextField).value
      if (!pairValue) {
        window.toast('Please enter a pair')
        return;
      }
      if (checkIn && !['m', 'h', 'd'].some(u => checkIn.includes(u))) {
        window.toast("check in should contain 'm', 'h', or 'd'")
        return;
      }

      pair = {
        pair: pairValue,
        checkInValue: checkIn,
        checkIn: checkIn ? (Date.now() + ms(checkIn)) : undefined,
        note: (this.$('mwc-textarea') as TextArea).value,
        checked: false
      }

      // this._resolve!(this.pair)
      // this.dialog.close()
      // this.resetDialog()
      // this.saveInformation()
      // this.requestUpdate()
    // }
    // else {
    //   pair = this.pair
    // }

    this._resolve!(pair)
    this.dialog.close()
    this.resetDialog()
  }

  private resetDialog () {
    (this.$('mwc-textfield[label=pair]') as TextField).value = '';
    (this.$('mwc-textfield[label="check in"]') as TextField).value = '';
    (this.$('mwc-textarea') as TextArea).value = '';
  }

  private onCheckInKeyup(e: any) {
    try {
      const _in = timeAgo.format(Date.now() + ms(e.target.value))
      e.target.helper = `check ${_in}`
    } catch (err) {
      e.target.helper = 'e.g. 1m, 2m, 5h, 3d, ...'
    }
  }

  private _resolve?: (value: Pair) => void;
  private _reject?: (reason?: any) => void;
  private async openDialog (pair?: Pair) {
    this.pair = pair;
    this.dialog.show()
    return new Promise((resolve: (value: Pair) => void, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    })
  }

  public async addPair () {
    try {
      const target = await this.openDialog()
      this.pairs.push(target)
      this.requestUpdate()
      window.pairInformation.requestUpdate()
      this.saveInformation()
      // this.resetDialog()
    }
    catch (e) {
      //cancelled
    }
  }

  public async editPair (pair: Pair) {
    try {
      const target = await this.openDialog(JSON.parse(JSON.stringify(pair))) // clone the object
      // We replace the original object
      this.pairs[this.pairs.indexOf(pair)] = target
      this.requestUpdate()
      window.pairInformation.open(target)
      // window.pairInformation.requestUpdate()
      this.saveInformation()
      // this.resetDialog()
    } catch (e) {
      // cancelled
    }
  }

  loadInformation () {
    if (localStorage.getItem('pairs-tracker:pairs'))
      this.pairs = JSON.parse(localStorage.getItem('pairs-tracker:pairs')!.toString())
    else
      this.pairs = []
  }

  saveInformation () {
    localStorage.setItem('pairs-tracker:pairs', JSON.stringify(this.pairs))
  }
}


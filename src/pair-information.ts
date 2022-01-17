import { css, html, LitElement, nothing } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Pair } from './main';
import coinmarketcap from 'coinmarketcap-s2l'
import { Dialog } from '@material/mwc-dialog';
import '@material/mwc-icon-button'
import { openCoinMarketCap } from './util';

declare global {
  interface Window {
    pairInformation: PairInformation;
  }
}

@customElement('pair-information')
export class PairInformation extends LitElement {
  @state()
  private pair?: Pair;

  @query('mwc-dialog') dialog!: Dialog;

  static styles = css`
  mwc-textarea {
    margin-top: 12px;
    width: 100%;
  }
  `

  render () {
    return html`
    <mwc-dialog heading=${this.pair ? this.pair.pair : ''}>
      ${this.pair ? html`
      <div style="text-align:right">
        <mwc-icon-button @click=${() => openCoinMarketCap(this.pair!)}>
          <img src="./img/coinmarketcap.ico">
        </mwc-icon-button>
      </div>

      <mwc-textarea disabled rows=8 cols=80 value=${this.pair.note}></mwc-textarea>
      ` : nothing}

      <mwc-button outlined slot="secondaryAction" icon=edit
        @click=${() => window.app.editPair(this.pair!)}>edit</mwc-button>
      <mwc-button unelevated slot="primaryAction" dialogAction="close">close</mwc-button>
    </mwc-dialog>
    `
  }


  public open(pair: Pair) {
    this.pair = pair;
    this.dialog.show()
  }
}
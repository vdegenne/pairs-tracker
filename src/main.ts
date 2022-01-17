import { LitElement, html, css, nothing } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
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

declare global {
  interface Window {
    app: AppContainer;
    toast: (labelText: string, timeoutMs?: number) => void;
  }
}

declare type Pair = {
  pair: string,
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
  `

  render () {
    return html`
    <header>
      <img src="./img/icon.png" width=68 style="margin-left:8px">
    </header>

    <div style="max-width:500px;margin:0 auto;">
    ${this.pairs.map(p => {
      return html`
      <div style="display:flex;align-items:center;justify-content:space-between;text-decoration:${p.checked ? 'line-through' : 'none'};opacity:${p.checked ? '0.5' : '1'};cursor:pointer"
        @click=${() => window.toast('to implement')}>
        <div style="display:flex;align-items:center">
        <mwc-checkbox
          @change=${(e) => { p.checked = e.target.checked; this.requestUpdate() }}></mwc-checkbox>
        <span>${p.pair}</span>
        </div>
        <div>${p.checkIn ? `check ${timeAgo.format(p.checkIn)}` : nothing}</div>
      </div>
      `
    })}
    </div>

    <div style="text-align:center">
      <mwc-button icon=add
      @click=${() => this.openDialog()}>pair</mwc-button>
    </div>

    <mwc-dialog heading=${this.pair || 'Add pair'}>
      <mwc-textfield label="pair" value=${this.pair?.pair}
        helper="if no slash defaults to 'USDT' quote"
        dialogInitialFocus></mwc-textfield>

      <mwc-textfield label="check in"
        helper="e.g. 1m, 2m, 5h, 3d, ..."
        @keyup=${(e) => this.onCheckInKeyup(e)}
      ></mwc-textfield>

      <mwc-textarea label="note" value=${this.pair?.note}
        rows=8></mwc-textarea>


      <mwc-button slot="secondaryAction" dialogAction="close">close</mwc-button>
      <mwc-button raised slot="primaryAction"
        @click=${() => this.onDialogAccept()}
        >${this.pair ? 'save' : 'add'}</mwc-button>
    </mwc-dialog>
    `
  }

  $ (selector: string) {
    return this.shadowRoot!.querySelector(selector)
  }

  private onDialogAccept() {
    if (this.pair === undefined) {
      const pair = (this.$('mwc-textfield[label=pair]') as TextField).value
      const checkIn = (this.$('mwc-textfield[label="check in"]') as TextField).value
      if (!pair) {
        window.toast('Please enter a pair')
        return;
      }
      if (checkIn && !['m', 'h', 'd'].some(u => checkIn.includes(u))) {
        window.toast("check in should contain 'm', 'h', or 'd'")
        return;
      }
      this.pairs.push({
        pair,
        checkIn: checkIn ? (Date.now() + ms(checkIn)) : undefined,
        note: (this.$('mwc-textarea') as TextArea).value,
        checked: false
      })

      this.dialog.close()
      this.resetDialog()
      this.requestUpdate()
    }
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

  openDialog (pair?: Pair) {
    this.pair = pair;
    this.dialog.show()
  }
}
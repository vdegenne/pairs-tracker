import coinmarketcap from 'coinmarketcap-s2l'
import { Pair } from './main'

export function openCoinMarketCap(pair: Pair) {
  const url = coinmarketcap(pair.pair.split('/')[0])
  if (url === undefined) {
    window.toast('this symbol has no coinmarketcap page associated')
  }
  else {
    window.open(url, '_blank')
  }
}

export function openCryptowatch (pair: Pair) {
  let symbol = pair.pair.split('/')[0]
  let quote = pair.pair.split('/')[1] || 'USDT'
  window.open(`https://cryptowat.ch/charts/BINANCE:${symbol}-${quote}`, '_blank')
}
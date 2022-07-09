import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { Context } from './lib/context';

function MyApp({ Component, pageProps }) {
  return <Context.Provider value={{fau:"0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc",bankAddress:"0xa4673E70d351B6Ad072d7855e89CBB33400Ca541"}}>
    <Component {...pageProps} />
    <Toaster/>
    </Context.Provider>
}

export default MyApp

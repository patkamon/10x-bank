import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';
import { Context } from './lib/context';

function MyApp({ Component, pageProps }) {
  return <Context.Provider value={{fau:"0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc",bankAddress:"0xBeae3420f7E33A28eC9b0Cd09e74242b618a085C"}}>
    <Component {...pageProps} />
    <Toaster/>
    </Context.Provider>
}

export default MyApp

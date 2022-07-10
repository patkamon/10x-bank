import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Context } from "../lib/context";

function MyApp({ Component, pageProps }) {
  return (
    <Context.Provider
      value={{
        fau: "0xba62bcfcaafc6622853cca2be6ac7d845bc0f2dc",
        bankAddress: "0x7F74738A6d0848fBD77421687790DB5A806BCAE9",
      }}
    >
      <Component {...pageProps} />
      <Toaster />
    </Context.Provider>
  );
}

export default MyApp;

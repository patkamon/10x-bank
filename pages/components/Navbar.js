import Link from 'next/link';
export default function Navbar() {
  
    return (
      <nav className="m-0 p-5 font-bold  flex flex-row justify-between ">
          <h1 className="text-3xl font-bold">🚀 10XBank</h1>
          <button className= " bg-scb1 hover:bg-scb2 text-white font-bold py-2 px-4 rounded">connect wallet</button>
      </nav>
    );
  }
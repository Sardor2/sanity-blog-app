import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <a>
            <img
              className="w-32 cursor-pointer object-contain sm:w-44"
              src="https://links.papareact.com/yvf"
            />
          </a>
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-green-600 px-4 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-green-600">
        <button>Sign In</button>
        <button className="rounded-full border border-green-600 px-4 py-1">
          Get Started
        </button>
      </div>
    </header>
  )
}

export default Header

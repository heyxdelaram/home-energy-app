"use client";

import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-xl font-bold text-green-600">
              <Link href="/">HOMENERG</Link>
            </div>
            {/* Links */}
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-gray-700 font-semibold hover:text-green-600"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className=" text-white bg-green-600 rounded-lg font-medium hover:bg-green-700 px-4 py-2"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center" style={{backgroundImage: "url('/2.jpg')", backgroundSize:"cover", backgroundPosition:'center', }}>
      <div className="bg-zinc-100 p-6 rounded-xl flex flex-col items-center justify-center lg:p-12">

        <h1 className="text-4xl text-center font-extrabold text-gray-800 mb-4">
          Welcome to your personal home energy manager!
        </h1>
        <p className="text-lg text-gray-600">
          Manage your energy efficiently and with ease.
        </p>
        <div className="mt-8">
          <Link
            href="/signup"
            className="px-6 py-2 text-white bg-green-600 rounded-lg font-medium hover:bg-green-700"
            >
            Get Started
          </Link>
        </div>
            </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} HOMENERG. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

"use client"


import Header from "@/components/Header"
import LoginRequired from "@/components/LoginRequired"


export default function JourneysLayout({ children }) {
  return (
    <LoginRequired>
      <div className="w-screen h-screen">
        <Header />
        <div className="w-full">
          { children }
        </div>
      </div>
    </LoginRequired>
  )
}
"use client";

import { useEffect } from "react";
import { useUser } from "~/hooks/api/auth";
import { redirect, RedirectType } from 'next/navigation'


export default function Home() {

  const { user } = useUser()

  useEffect(() => {
    if (user && user.id) {
      console.log(user)

      // redirect('/redirect-to', RedirectType.replace)
    }
  }, [user])

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>


      </div>
    </main>
  );
}

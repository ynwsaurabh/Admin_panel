import React from 'react'
import FloatingButton from '@/Component/FloatingBtn'
import { redirect } from 'next/navigation'
redirect
const page = () => {
  const auth =false;
  if(!auth){
    redirect('/verify/login')
  }
  return (
    <div>page</div>
    
    
  )
}

export default page
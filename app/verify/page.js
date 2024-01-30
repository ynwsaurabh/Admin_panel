import React from 'react'
import FloatingButton from '@/Component/FloatingBtn'
import { redirect } from 'next/navigation'
redirect
const verify = () => {
  const auth =false;
  if(!auth){
    redirect('/verify/login')
  }
  return (
    <div>verify</div>
    
    
  )
}

export default verify
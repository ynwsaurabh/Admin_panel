'use client'
import React, { useEffect } from 'react'
import './Profile.css'
import { AiOutlineLogout } from "react-icons/ai";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import FirebaseConfig from '@/Component/Config';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Profile = () => {
  const router =useRouter();
  const app =FirebaseConfig();

    const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          toast.error('Login First')
          router.push('/verify/login')
        }
      });
 
  

  const logout = () =>{
    const auth = getAuth();
    signOut(auth)
  .then(() => {
    toast.success("User signed out successfully");
    router.replace('/verify/login')
  })
  .catch((error) => {
    console.error("Error signing out:", error);
  });
}
  return (
    <>
      <div className="profile">
        <div className="userProfilePicture">
          <img
            className="profilePicture"
            src='/Images/person.png'
            alt="Profile"
            loading="lazy"
          />

        </div>
        <div className="profileInfoPrimary">
          <h1>Name : Admin</h1>
          <h1>college : AVM's Karmaveer Bhaurao Patil Degree College</h1>
          <h1>Address :  Rd Number 16U, nahuru nagar, Wagle Industrial Estate, Thane West, Thane, Maharashtra 400604</h1>
          <h1 className='website'>Website : <a href='https://www.kbpcollegethane.net/'>Our Website &nbsp; <BsBoxArrowUpRight/></a> </h1>
          <h1 className='location'>Location : <a href='https://www.google.com/maps/dir//K+B+P+DEGREE+COLLEGE,+Rd+Number+16U,+nahuru+nagar,+Wagle+Industrial+Estate,+Thane+West,+Thane,+Maharashtra+400604/@19.1966005,72.8699376,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3be7b90f5aaf5671:0x8db2ed1acc0b611a!2m2!1d72.9523386!2d19.1964568?entry=ttu'> Location &nbsp; <BsBoxArrowUpRight/></a></h1>
          <h1>Phone : 085914 98099  <FiPhone /></h1>

          <h1
            className="profileInfoEdit"
            onClick={logout}
          >
            <AiOutlineLogout /> &nbsp;Logout
          </h1>
        </div>
      </div>
    </>
  )
}

export default Profile
"use client"
import React, { useEffect, useState } from 'react'
import './Notice.css'
import { useRouter } from 'next/navigation'
import { set, get, getDatabase, ref } from "firebase/database";
import FirebaseConfig from '@/Component/Config';
import FloatingButton from '@/Component/FloatingBtn';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';
const Notice = () => {
  const [data, setData] = useState([]);
  const app = FirebaseConfig();
  const db = getDatabase(app);
  const router = useRouter();

  useEffect(() => {

    const fetchData = async () => {
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          toast.error('Login First')
          router.replace('/verify/login')
        }
      });
      const noticeRef = ref(db, 'Notice/')
      await get(noticeRef).then((snapshot) => {
        if (snapshot.exists()) {
          const noticeData = Object.entries(snapshot.val()).map(([key, notice]) => ({
            id: key,
            ...notice,
          }));
          setData(noticeData.reverse());
        } else {
          console.log("No Data Found")
        }
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    return () => { fetchData(); };

  }, [])

  const renderDescription = (description) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const withLinks = description.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
    return (
      <div
        style={{ fontSize: 13 }}
        className='primary-info description-scrollable'
        dangerouslySetInnerHTML={{ __html: withLinks }}
      />
    );
  };

  const handleEdit = (noticeId) => {
    router.push(`/Notice/${noticeId}`);
  };

  const AddNotice = () => {
    router.push(`/Notice/AddNotice`);
  }

  return (
    <div >
      <div id='notice-card-container'>
        {data.map((e) => (
          <div key={e.id} id='notice-card'>
            {e.image && (
              <div className="noticeCardContainer">
                <a target='_blank' href={e.image}><img src={e.image} alt='notice' /></a>
              </div>
            )}
            <div className='primary-info'>{e.title}</div>
            {renderDescription(e.description)}
            <div className='dateTime'>
              <div id='date'>{e.date}</div>
              <div id='time'>{e.time}</div>
            </div>
            <button id="btnEdit" onClick={() => handleEdit(e.id)}>
              Edit &nbsp;
              <svg className="svgIcon" width='17px' viewBox="0 0 512 512">
                <path fill='#ff8400' d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <FloatingButton onClick={() => AddNotice()} />
    </div>
  )
}

export default Notice
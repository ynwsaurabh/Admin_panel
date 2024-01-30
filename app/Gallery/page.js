'use client'
import React, { useEffect, useState } from 'react'
import './Gallery.css'
import { useRouter } from 'next/navigation';
import { set, get, ref, getDatabase } from "firebase/database";
import FirebaseConfig from '@/Component/Config';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FloatingButton from '@/Component/FloatingBtn';
import { toast } from 'react-toastify';

const Gallery = () => {
  const [yuvaData, setYuvaData] = useState([]);
  const [techData, setTechnoData] = useState([]);
  const [independenceData, setIndependenceData] = useState([]);
  const [annualData, setAnnualData] = useState([]);
  const [artData, setArtData] = useState([]);
  const app = FirebaseConfig();
  const db = getDatabase(app);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          toast.error('Login First')
          router.replace('/verify/login')
        }
      });

      const techRef = ref(db, 'gallery/Technoholic')
      await get(techRef).then((snapshot) => {
        if (snapshot.exists()) {

          const Technoholic = Object.entries(snapshot.val()).map(([key, data]) => ({
            id: key,
            url: Object.values(data).join(''),
          }));
          setTechnoData(Technoholic);
        } else {
        }
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    })();
  }, [])

  useEffect(() => {
    (async () => {
      const yuvaRef = ref(db, 'gallery/Yuva Tarang')
      get(yuvaRef).then((snapshot) => {
        if (snapshot.exists()) {

          const yuvaTarang = Object.entries(snapshot.val()).map(([key, data]) => ({
            id: key,
            url: Object.values(data).join(''),
          }));
          setYuvaData(yuvaTarang);
        } else {
        }
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    })();

  }, [])

  useEffect(() => {
    (async () => {
      const independenceRef = ref(db, 'gallery/Independence Day')
      get(independenceRef).then((snapshot) => {
        if (snapshot.exists()) {

          const independence = Object.entries(snapshot.val()).map(([key, data]) => ({
            id: key,
            url: Object.values(data).join(''),
          }));
          setIndependenceData(independence);
        } else {
        }
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    })();

  }, [])

  useEffect(() => {
    (async () => {
      const annualRef = ref(db, 'gallery/Annual Day')
      get(annualRef).then((snapshot) => {
        if (snapshot.exists()) {

          const annual = Object.entries(snapshot.val()).map(([key, data]) => ({
            id: key,
            url: Object.values(data).join(''),
          }));
          setAnnualData(annual);
        } else {
        }
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    })();

  }, [])

  useEffect(() => {
    (async () => {
      const artRef = ref(db, 'gallery/Art Work')
      get(artRef).then((snapshot) => {
        if (snapshot.exists()) {

          const art = Object.entries(snapshot.val()).map(([key, data]) => ({
            id: key,
            url: Object.values(data).join(''),
          }));
          setArtData(art);
        } else {
        }
      })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });

    })();
  }, [])

  const AddImages = () => {
    router.push(`/Gallery/AddImages`);
  }

  return (
    <div>

      <div id='label'>Technoholic</div>
      {yuvaData.length === 0 ? (
        <div id='noDataFound'> No Data Found</div>
      ) : (
        <div id='tilesContainer'>
          {techData.map((e) =>
            <div key={e.id} className='tileItem'>
              <a href={e.url}><img src={e.url} loading='lazy' /></a>
            </div>
          )}
        </div>
      )}

      <div id='label'>Yuva Tarang</div>
      {yuvaData.length === 0 ? (
        <div id='noDataFound'> No Data Found</div>
      ) : (
        <div id='tilesContainer'>
          {yuvaData.map((e) =>
            <div key={e.id} className='tileItem'>
              <a href={e.url}><img src={e.url} loading='lazy' /></a>
            </div>
          )}
        </div>
      )}

      <div id='label'>Independence Day</div>
      {independenceData.length === 0 ? (
        <div id='noDataFound'> No Data Found</div>
      ) : (
        <div id='tilesContainer'>
          {independenceData.map((e) =>
            <div key={e.id} className='tileItem'>
              <a href={e.url}><img src={e.url} loading='lazy' /></a>
            </div>
          )}
        </div>
      )}

      <div id='label'>Annual Day</div>
      {annualData.length === 0 ? (
        <div id='noDataFound'> No Data Found</div>
      ) : (
        <div id='tilesContainer'>
          {annualData.map((e) =>
            <div key={e.id} className='tileItem'>
              <a href={e.url}><img src={e.url} loading='lazy' /></a>
            </div>
          )}
        </div>
      )}

      <div id='label'>Art Work</div>
      {artData.length === 0 ? (
        <div id='noDataFound'> No Data Found</div>
      ) : (
        <div id='tilesContainer'>
          {artData.map((e) =>
            <div key={e.id} className='tileItem'>
              <a href={e.url}><img src={e.url} loading='lazy' /></a>
            </div>
          )}
        </div>
      )}
      <FloatingButton onClick={() => { AddImages() }} />
    </div>
  )
}

export default Gallery
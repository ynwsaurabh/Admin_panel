'use client'
import '../Notice.css';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { set, get, ref, remove, getDatabase } from "firebase/database";
import FirebaseConfig from '@/Component/Config';
import { ref as Sref, getDownloadURL, deleteObject, uploadBytes, getStorage } from 'firebase/storage';
import '../../Faculty/AddFaculty/AddFaculty.css'
import { toast } from 'react-toastify';

const page = ({ params }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    date: '',
    time: '',
    key: '',
  });
  const id = params.noticeId;

  const app = FirebaseConfig();
  const db = getDatabase(app);
  const router = useRouter();

  const auth = getAuth(app);
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      toast.error('Login First')
      router.replace('/verify/login')
    }
  });

  useEffect(() => {
    const container = document.querySelector(".notice-image-container");
    const noticeRef = ref(db, 'Notice/' + `${id}`)
    get(noticeRef).then((snapshot) => {
      const noticeData = snapshot.val();
      if (noticeData) {
        setFormData({
          title: noticeData.title,
          description: noticeData.description,
          image: noticeData.image || '',
          date: noticeData.date,
          time: noticeData.time,
          key: noticeData.key,
        });
      }
      container.innerHTML = noticeData.image ? `<img class="noticePicture" src=${noticeData.image} alt='profile' />`
        :
        `<svg viewBox="0 0 640 512" height="7em">
            <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
          </svg>`

    })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

  }, [])

  const handleIconClick = () => {
    // const editIcon = document.querySelector(".editImageIcon");
    const inputImage = document.querySelector("#inputImage");
    inputImage.click();
    inputImage.addEventListener("change", (event) => {
      const container = document.querySelector(".notice-image-container");
      const image = event.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        image: event.target.files[0],
      }));

      container.innerHTML = `<img class="noticePicture" src="${URL.createObjectURL(image)}" alt="Preview" loading="lazy" />`
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getCurrentDateTime = () => {
    const currentDate = new Date();

    // Get date in 'DD-MM-YYYY' format
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${day}-${month}-${year}`;

    // Get time in 'hh:mm AM/PM' format
    const hours = String(currentDate.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const ampm = currentDate.getHours() >= 12 ? 'PM' : 'AM';
    const time = `${hours}:${minutes} ${ampm}`;

    return { date, time };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputImage = document.querySelector("#inputImage");
    const { date, time } = getCurrentDateTime();
    const { title, description, image } = formData;
    const childRef = ref(db, `Notice` + `/${id}`)
    if (inputImage.files[0]) {
      const storage = getStorage(app);
      const storageRef = Sref(storage, '/NoticeImage' + `/${id}`)
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      const newData = {
        title: title,
        description: description,
        key: id,
        date: date,
        time: time,
        image: downloadURL,
      };
      set(childRef, newData).then(() => {
        toast.success("Notice updated successfully")
      })
    }
    else {
      const { date, time } = getCurrentDateTime();
      const prevData = {
        title: title,
        description: description,
        key: id,
        date: date,
        time: time,
        image: image,
      };
      set(childRef, prevData).then(() => {
        toast.success('Details Updated');
      })
        .catch((error) => {
          toast.error(error);
        })
    }
    router.refresh();
  }

  const handleDelete = async () => {
    const deleteNotice = ref(db, `/Notice/${id}`);
    const storage = getStorage(app);
    const imageRef = Sref(storage, '/NoticeImage' + `/${id}`);
    const noticeSnapshot = await get(deleteNotice);
    const noticeData = noticeSnapshot.val();

    if (noticeData.image != '') {
      await deleteObject(imageRef);
      await remove(deleteNotice)
        .then(() => {
          console.log('Notice deleted successfully!');
          router.push("/Notice");
        })
    } else {
      await remove(deleteNotice)
        .then(() => {
          console.log('Notice deleted successfully!');
          router.push("/Notice");
        })
        .catch((error) => {
          console.error('Error deleting Notice:', error);
        });
    }
  }
  return (
    <div className="editProfileWrapper">
      <form className="editProfileContainer" onSubmit={handleSubmit}>
        <div className="editProfileHeader">
          <h4 className="header">EDIT NOTICE</h4>
          <button type='button' class="btnDelete" onClick={handleDelete}>
            <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
              <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
            </svg>
          </button>
        </div>
        <div className="editProfileForm">
          <div className="editProfilePrimary">
            <input id="inputImage" type="file"
              accept="image/*" name="image" />
            <svg stroke="currentColor" fill="currentColor"
              strokeWidth="0" viewBox="0 0 1024 1024"
              className="noticeImageIcon" height="1em"
              width="1em" onClick={() => handleIconClick()}
              xmlns="http://www.w3.org/2000/svg"><path
                d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
            </svg>
            <div className="notice-image-container">
              <svg viewBox="0 0 640 512" height="7em">
                <path
                  d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                ></path>
              </svg>
            </div>

          </div>
          <div className="editProfileSecondary">

            <label className="inputSection" id="title">
              Title
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            <label class="inputSection" id="bio">
              Description
              <textarea id="description" type="text"
                name="description" rows="2"
                value={formData.description}
                onChange={handleChange}
                required>
              </textarea>
            </label>
          </div>
        </div>
        <button type="submit" style={{ bottom: 0 }} className="btn editBtn"> Edit Notice </button>
      </form>
    </div>
  )
}

export default page
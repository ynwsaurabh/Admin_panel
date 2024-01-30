'use client'
import FirebaseConfig from '@/Component/Config';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { set, get, remove, push, ref, update, getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref as Sref, deleteObject, getDownloadURL, uploadBytes, getStorage } from 'firebase/storage';
import '../AddFaculty/AddFaculty.css'
import { toast } from 'react-toastify';
const EditFaculty = ({ params }) => {
    const id = params.editFaculty;
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category')

    const app = FirebaseConfig();
    const db = getDatabase(app);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        post: '',
        department: '',
        image: null,
    });

    useEffect(() => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                toast.error('Login First')
                router.replace('/verify/login')
            }
        });
        const container = document.querySelector(".circular-container");
        const facultyRef = ref(db, '/Faculty/' + `${category}/` + `${id}`)
        get(facultyRef).then((snapshot) => {
            const facultyData = snapshot.val();
            if (facultyData) {
                setFormData({
                    name: facultyData.name,
                    email: facultyData.email,
                    post: facultyData.post,
                    department: facultyData.category,
                    image: facultyData.image,
                });
            }
            container.innerHTML = facultyData.image ? `<img class="profilePicture" src=${facultyData.image} alt='profile' />`
                :
                `<svg className="pfp" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 122.88 122.88"><g><path d="M61.44,0c8.32,0,16.25,1.66,23.5,4.66l0.11,0.05c7.47,3.11,14.2,7.66,19.83,13.3l0,0c5.66,5.65,10.22,12.42,13.34,19.95 c3.01,7.24,4.66,15.18,4.66,23.49c0,8.32-1.66,16.25-4.66,23.5l-0.05,0.11c-3.12,7.47-7.66,14.2-13.3,19.83l0,0 c-5.65,5.66-12.42,10.22-19.95,13.34c-7.24,3.01-15.18,4.66-23.49,4.66c-8.31,0-16.25-1.66-23.5-4.66l-0.11-0.05 c-7.47-3.11-14.2-7.66-19.83-13.29L18,104.87C12.34,99.21,7.78,92.45,4.66,84.94C1.66,77.69,0,69.76,0,61.44s1.66-16.25,4.66-23.5 l0.05-0.11c3.11-7.47,7.66-14.2,13.29-19.83L18.01,18c5.66-5.66,12.42-10.22,19.94-13.34C45.19,1.66,53.12,0,61.44,0L61.44,0z M16.99,94.47l0.24-0.14c5.9-3.29,21.26-4.38,27.64-8.83c0.47-0.7,0.97-1.72,1.46-2.83c0.73-1.67,1.4-3.5,1.82-4.74 c-1.78-2.1-3.31-4.47-4.77-6.8l-4.83-7.69c-1.76-2.64-2.68-5.04-2.74-7.02c-0.03-0.93,0.13-1.77,0.48-2.52 c0.36-0.78,0.91-1.43,1.66-1.93c0.35-0.24,0.74-0.44,1.17-0.59c-0.32-4.17-0.43-9.42-0.23-13.82c0.1-1.04,0.31-2.09,0.59-3.13 c1.24-4.41,4.33-7.96,8.16-10.4c2.11-1.35,4.43-2.36,6.84-3.04c1.54-0.44-1.31-5.34,0.28-5.51c7.67-0.79,20.08,6.22,25.44,12.01 c2.68,2.9,4.37,6.75,4.73,11.84l-0.3,12.54l0,0c1.34,0.41,2.2,1.26,2.54,2.63c0.39,1.53-0.03,3.67-1.33,6.6l0,0 c-0.02,0.05-0.05,0.11-0.08,0.16l-5.51,9.07c-2.02,3.33-4.08,6.68-6.75,9.31C73.75,80,74,80.35,74.24,80.7 c1.09,1.6,2.19,3.2,3.6,4.63c0.05,0.05,0.09,0.1,0.12,0.15c6.34,4.48,21.77,5.57,27.69,8.87l0.24,0.14 c6.87-9.22,10.93-20.65,10.93-33.03c0-15.29-6.2-29.14-16.22-39.15c-10-10.03-23.85-16.23-39.14-16.23 c-15.29,0-29.14,6.2-39.15,16.22C12.27,32.3,6.07,46.15,6.07,61.44C6.07,73.82,10.13,85.25,16.99,94.47L16.99,94.47L16.99,94.47z"></path></g>
                </svg>`

        })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [])

    const handleIconClick = () => {
        const inputImage = document.querySelector("#inputImage");
        inputImage.click();
        inputImage.addEventListener("change", (event) => {
            const container = document.querySelector(".circular-container");
            const image = event.target.files[0];

            setFormData((prevData) => ({
                ...prevData,
                image: event.target.files[0],
            }));
            container.innerHTML = `<img class="profilePicture" src="${URL.createObjectURL(image)}" alt="Preview" loading="lazy" />`

        });
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputImage = document.querySelector("#inputImage");
        const { name, email, post, department, image } = formData;
        const upfacultyRef = ref(db, `Faculty/${department}/${id}`)
        if (inputImage.files[0]) {
            const storage = getStorage(app);
            const storageRef = Sref(storage, '/Faculty' + `/${id}`)
            await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(storageRef);
            const newData = {
                name: name,
                email: email,
                post: post,
                key: id,
                category: department,
                image: downloadURL,
            };
            set(upfacultyRef, newData);
            toast.success('Details Updated');
        } else {
            const prevData = {
                name: name,
                email: email,
                post: post,
                key: id,
                category: department,
                image: image,
            };
            set(upfacultyRef, prevData).then(() => {
                toast.success('Details Updated');
            })
                .catch((error) => {
                    toast.error(error);
                })
        }
        router.refresh();
    }

    const handleDelete = async () => {
        const deleteFaculty = ref(db, `/Faculty/${category}/${id}`);
        const storage = getStorage(app);
        const imageRef = Sref(storage, '/Faculty' + `/${id}`);
        const facultySnapshot = await get(deleteFaculty);
        const facultyData = facultySnapshot.val();

        if (facultyData && facultyData.image) {
            await deleteObject(imageRef);
            await remove(deleteFaculty)
                .then(() => {
                    console.log('Faculty data deleted successfully!');
                    router.push("/Faculty");
                })
        }
        await remove(deleteFaculty)
            .then(() => {
                console.log('Faculty data deleted successfully!');
                router.push("/Faculty");
            })
            .catch((error) => {
                console.error('Error deleting faculty data:', error);
            });

    }

    return (
        <div className="editProfileWrapper">
            <form className="editProfileContainer" onSubmit={handleSubmit}>
                <div className="editProfileHeader">
                    <h4 className="header">EDIT FACULTY</h4>
                    <button class="btnDelete" onClick={() => handleDelete()}>
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
                            className="editImageIcon" height="1em"
                            width="1em" onClick={() => handleIconClick()}
                            xmlns="http://www.w3.org/2000/svg"><path
                                d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path>
                        </svg>
                        <div className="circular-container">
                        </div>
                        <div className="removeProfilePhoto">
                        </div>
                    </div>
                    <div className="editProfileSecondary">

                        <label className="inputSection" id="name">
                            Name
                            <input
                                id="facultyName"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="inputSection" id="email">
                            Email
                            <input
                                id="facultyEmail"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="inputSection" id="post">
                            Post
                            <input
                                id="facultyPost"
                                type="text"
                                name="post"
                                value={formData.post}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="inputSection" id="department">
                            Department
                            <div className="Department">
                                <select
                                    id="petBreed"
                                    className="styledSelect"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    disabled
                                >
                                    <option value="" disabled>
                                        Select Department
                                    </option>
                                    <option value="IT">IT</option>
                                    <option value="BA">BA</option>
                                    <option value="BAF">BAF</option>
                                    <option value="BBI">BBI</option>
                                    <option value="Bcom">Bcom</option>
                                </select>
                            </div>
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn editBtn"> Edit Faculty </button>
            </form>
        </div>
    )
}

export default EditFaculty
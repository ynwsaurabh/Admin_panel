'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
FirebaseConfig
import './AddImages.css'
import { set, get, push, ref } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {ref as Sref, getDownloadURL, uploadBytes, getStorage} from 'firebase/storage';
import { toast } from 'react-toastify';
import FirebaseConfig from '@/Component/Config'

const AddImages = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dropDownValue, setDropDownValue] = useState('');
    const router = useRouter();
    const db =FirebaseConfig();
    
    const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          toast.error('Login First')
          router.replace('/verify/login')
        }
      });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const filesData = files.map((file) => ({
            // id: generateUniqueId(),
            name: file.name,
            url: URL.createObjectURL(file),
            file: file
        }));
        setSelectedFiles(filesData);
        const mergedFiles = filesData.concat(selectedFiles);
        setSelectedFiles(mergedFiles);
    }

    const handleSelectImage = () => {
        document.querySelector('input').click();
    }

    const handleChange = (e) =>{
        setDropDownValue(e.target.value);
    }
    const handleClear = (e) =>{
        setSelectedFiles(['']);
    }
    const handleUpload = async () =>{
        if(dropDownValue == ''){
            toast.error('Please select Category');
        }
        else{
        const imageRef = ref(db, `/gallery/${dropDownValue}`);
        const storage = getStorage();
        
        const uploadPromises = selectedFiles.map(async (fileData) => {
            const { name, file } = fileData;
            const key = push(imageRef).key;
            const imageDbRef =ref(db, `/gallery/${dropDownValue}/${key}`);
            const imageStorageRef = Sref(storage, '/gallery'+ `/${key}`)

            await uploadBytes(imageStorageRef, file);
            const downloadURL = await getDownloadURL(imageStorageRef);

            await set(imageDbRef, downloadURL);
      
            return { name, downloadURL };
          });
          try {
            await Promise.all(uploadPromises);
            toast.success("Uploded Successfully")
            setSelectedFiles(['']);
          } catch (error) {
            toast.error(error)
          }
        }
    }


    return (
        <div className='imageWrapper'>
            {selectedFiles == 0 ? (
                <div id="splash-content-file-dropper">
                    <svg id="splash-drop-icon" width="144" height="144" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="ic">
                        <path fill="black" d="m2.4181 18.932-.88153-2.6572c-.15261-.47904-.11194-.99876.11334-1.4482.22542-.44773.61956-.78751 1.0956-.9445l10.376-3.6535c1.0084-.31165 2.0787.2517 2.3927 1.2593l2.5187 7.6819-3.3372-1.2593c-.30284-.11333-.64271.01615-.79338.30224l-2.8713 5.6922-2.6194-1.2593c-.25747-.12309-.56528-.061529-.7556.15112l-3.0217 2.8349-1.3349-4.1054zm13.599-11.504 2.2046-4.1762c.48035-.90871 1.5959-1.2713 2.5187-.81856l8.9412 4.6343c.44898.23275.785.63688.9319 1.1208.15189.4749.11119.99045-.11334 1.4356l-3.778 7.1908-1.3979-3.2994c-.12273-.30199-.45918-.45643-.76819-.35261l-6.5233 2.0779-1.423-4.2565c-.26042-.79413-.82707-1.4514-1.5742-1.826-.74599-.37996-1.6147-.43909-2.4053-.16371l-10.275 3.6283c-.79626.25664-1.4549.82441-1.826 1.5742-.39061.74691-.45443 1.6222-.17631 2.4179l.86894 2.7201.89412 2.5942 2.6068 7.8204c.26042.79413.82707 1.4514 1.5742 1.826.43924.21468.92155.32664 1.4104.32743.33841.001.67464-.05428.99487-.16371l10.364-3.6409c.79626-.25664 1.4549-.82441 1.826-1.5742.39061-.74691.45443-1.6222.17631-2.4179l-.10074-.30224h.06297c1.544.79997 3.4442.19665 4.2439-1.3475l6.3722-12.291c.79997-1.544.19665-3.4442-1.3475-4.2439l-8.9412-4.6343c-1.544-.79997-3.4442-.19665-4.2439 1.3475l-2.2046 4.2139m9.5717 7.6741 1.5742 3.778-1.889 3.6395c-.48035.90871-1.5959 1.2713-2.5187.81856l-1.2593-.62966-1.889-5.6796zm-4.7099 11.435c-.22542.44773-.61956.78751-1.0956.9445l-10.376 3.6535c-.97969.33024-2.0446-.17712-2.4053-1.146l-.7556-2.4053 3.1477-3.0994 2.7453 1.3727c.1533.06298.32524.06298.47854 0 .16013-.04975.29241-.16378.3652-.31483l2.9342-5.8559 3.778 1.4734.71782 2.1409.60448 1.7882c.14485.4823.09513 1.0021-.13853 1.4482zM8.4285 2.461h.61539v.61539a.61539.61539 0 0 0 1.2308 0V2.461h.61539a.61539.61539 0 0 0 0-1.2308h-.61539V.61481a.61539.61539 0 0 0-1.2308 0v.61539H8.4285a.61539.61539 0 0 0 0 1.2308zM24.429 29.538h-.61539v-.61539a.61539.61539 0 0 0-1.2308 0v.61539h-.61539a.61539.61539 0 0 0 0 1.2308h.61539v.61539a.61539.61539 0 0 0 1.2308 0v-.61539h.61539a.61539.61539 0 0 0 0-1.2308zM3.6591 7.6918a2 2 0 1 0-2-2 2 2 0 0 0 2 2zm0-3a1 1 0 1 1-1 1 1 1 0 0 1 1-1zM29 23a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 3a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"></path>
                        <circle cx="6.0883" cy="17.303" r="1.875" fill="#fff"></circle>
                        <circle cx="20.641" cy="8.0821" r="1.875" fill="#fff"></circle>
                    </svg>
                    <a id="splash-open-photo" className="button positive large rounded" style={{ paddingleft: 0 }} onClick={handleSelectImage}>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <svg width="18" height="18" version="1.1" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="m8 14.1v-10.1c0-0.519 0.446-0.938 1-0.938s1 0.418 1 0.938v10.1c0 0.519-0.446 0.938-1 0.938s-1-0.418-1-0.938z" fill="#fff" />
                            <path d="m4.12 8h9.75c0.624 0 1.12 0.446 1.12 1s-0.501 1-1.12 1h-9.75c-0.624 0-1.12-0.446-1.12-1s0.501-1 1.12-1z" fill="#fff" />
                        </svg>Select photo(s)
                    </a>
                </div>
            ) : (
                <div id="section" className="flatbox" >
                    <div id="content" className="holder">
                        <div id="add-image" onClick={handleSelectImage}>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="black" stroke="#ffffff" strokeWidth="1.5">
                                    <path d="M2 14c0-3.771 0-5.657 1.172-6.828C4.343 6 6.229 6 10 6h4c3.771 0 5.657 0 6.828 1.172C22 8.343 22 10.229 22 14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14Z" />
                                    <path d="m4 7l-.012-1c.112-.931.347-1.574.837-2.063C5.765 3 7.279 3 10.307 3h3.211c3.028 0 4.541 0 5.482.937c.49.489.725 1.132.837 2.063v1" />
                                    <circle cx="17.5" cy="10.5" r="1.5" />
                                    <path strokeLinecap="round" d="m2 14.5l1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 20.5" />
                                </g>
                            </svg>
                            &nbsp;Add photo(s)
                        </div>
                        {selectedFiles.map((file) => (
                            <div className="box">
                                <img src={file.url} />
                                {/* <canvas width="157" height="200"></canvas> */}
                                <span className="meta">{file.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="buttons top-20">
                        <div className="Category">
                            <select
                                className="styledSelect"
                                value={dropDownValue}
                                onChange={handleChange}
                                required
                            >
                                <option value="" selected disabled>
                                    Select Category
                                </option>
                                <option value="Technoholic">Technoholic</option>
                                <option value="Annual Day">Annual Day</option>
                                <option value="Yuva Tarang">Yuva Tarang</option>
                                <option value="Independence Day">Independence Day</option>
                                <option value="Art Work">Art Work</option>
                            </select>
                        </div>
                        <a id="clear" className="button med negative" onClick={handleClear}>Clear All</a>
                        <a id="export" className="button med positive" onClick={handleUpload}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="20px" width="18px" version="1.1" id="Capa_1" viewBox="0 0 374.116 374.116" >
                                <g>
                                    <path d="M344.058,207.506c-16.568,0-30,13.432-30,30v76.609h-254v-76.609c0-16.568-13.432-30-30-30c-16.568,0-30,13.432-30,30   v106.609c0,16.568,13.432,30,30,30h314c16.568,0,30-13.432,30-30V237.506C374.058,220.938,360.626,207.506,344.058,207.506z" />
                                    <path d="M123.57,135.915l33.488-33.488v111.775c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30V102.426l33.488,33.488   c5.857,5.858,13.535,8.787,21.213,8.787c7.678,0,15.355-2.929,21.213-8.787c11.716-11.716,11.716-30.71,0-42.426L208.271,8.788   c-11.715-11.717-30.711-11.717-42.426,0L81.144,93.489c-11.716,11.716-11.716,30.71,0,42.426   C92.859,147.631,111.855,147.631,123.57,135.915z" />
                                </g>
                            </svg>&nbsp;Upload
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddImages
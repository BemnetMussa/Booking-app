import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";

export default function PlacesPage() {
    const {action} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos]= useState([]);
    const [photoLink,setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);

    function inputHeader(text) {
        return (   
        <h2 className="text-2xl mt-4">{text}</h2>
        )
    }
    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description) {
        return (<>

            {inputHeader(header)}
            {inputDescription(description)}
        </>

        )
    }

    async function addPhotoByLink(e) {
        
        e.preventDefault(); // to make the page doesn't fully reload
        const {data:filename} = await axios.post('/upload-by-link', {link:photoLink})
        setAddedPhotos(prev => {
            return [...prev, filename];
        });

        setPhotoLink('')
    }
    
    return (
        <div>
            {action !== "new" && (
                <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                         <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new Places
                </Link>
            </div>
            )}

            {action === "new" && (
                <div>
                    <form action="">
                        {preInput("Title", "Title for your place. should be short and catchy as in advertisement")}
                        <input type="text" placeholder="title, for example: My lovely appartement" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)}/>

                        {preInput("Address", "ADdress to this place")}
                        <input type="text" placeholder="address" 
                                value={address}
                                onChange={e => setAddress(e.target.value)}/>

                        {preInput("Photos", "more == better")}
                
                        <div className="flex">
                            <input type="text" placeholder={'Add using a link ....jpg'} 
                                 value={photoLink}
                                 onChange={e => setPhotoLink(e.target.value)} />

                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                        </div>
                        <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length > 0 && addedPhotos.map(link => {
                                <div>
                                    <img className ="rounded-2xl" src={'http://localhost:5173/uploads/' + link } alt ="" />

                                </div>
                            }) }

                            <button className="inline-flex items-center gap-1 justify-center  border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>

                                Upload
                            </button>
                        </div>

                        {preInput("Description", "description of the place")}
                        <textarea value={description} onChange={setDescription}/>
                        {preInput("Perks", "select all the perks of your place")}
     
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                           <Perks selected={perks} onChange={setPerks} />
                        </div>
                        {preInput("Extra Info", "house rules, etc.")}
                        <textarea 
                                value={extraInfo} 
                                onChange={e => setExtraInfo(e => e.target.value)}/>
                        
                        {preInput("Check in&out times", "add check in and out times remeber to have some time window for cleaning the room between guests")}

                        <div className="grid gap-2 sm:grid-cols-3">
                            <div className="mt-2 -mb-2">
                                <h3>Check in time</h3>
                                <input type="text"
                                     value={checkIn} 
                                     onChange={e => setCheckIn(e.target.value)} 
                                     placeholder="14" />
                            </div>
                             <div  className="mt-2 -mb-2">
                                <h3>Check out time</h3>
                                <input type="text" 
                                    value={checkOut} 
                                    onChange={e => setCheckOut(e.target.value)} 
                                    placeholder="11"/>
                            </div>
                             <div  className="mt-2 -mb-2">
                                <h3>Max number of guests</h3>
                                <input type="number" 
                                    value={maxGuests}
                                    onChange={e => setMaxGuests(e.target.value)}
                                    placeholder="12" />
                            </div>

                            
                        </div>
                        <button className="primary my-4">Save</button>
                    </form>
                </div>
            )}
        </div>
    )
}
import React , { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import maplibregl  from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import axios from 'axios';
import { format } from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';
import {AiFillStar} from "react-icons/ai";
import {MdRoom}  from "react-icons/md";


function App() { 
  // o store the currentuser in locasl stor
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlacedId, setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  }

  const handleAddClick = (e)=> {
    // console.log(e);
    // e.lngLat would be array then this is fine
    // but here it is object not array(as in video)
    // const [lat,long] = e.lngLat;
    setNewPlace({
       lat : e.lngLat.lat,
       long : e.lngLat.lng,
    });
  };

  const handleSubmit = async (e) => {
    // this is done to prevent refresh of the page on submitting
     e.preventDefault ();
     const createPin = {
        username:currentUser,
        title:title,
        desc:desc,
        rating:rating,
        lat:newPlace.lat,
        long:newPlace.long,
     }
     // to sent to backend
     try {
      const res = await axios.post("/pins",createPin);
      // pins storing all the pins in database
      setPins([...pins,res.data]);
      // to remove the popup after creation
      setNewPlace(null);
     }catch(err) {
        console.log(err);
     }
  };

  const handleLogout = () => {
      myStorage.removeItem("user");
      setCurrentUser(null);
  }

  return (
    <div className="App">
      <Map  mapLib={maplibregl}
        initialViewState={{
          longitude: 79.974380,
          latitude: 23.185884,
          zoom: 2,
        }}
        maxZoom={11}
        minZoom={2}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.REACT_APP_API_KEY}`}
        onDblClick={currentUser && handleAddClick}
        
      >
       
        {pins.map(p => (
          <>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              offsetLeft={-20}
              offsetTop={-10}
              // color = {p.username === currentUser ? "tomato" : "slateblue"}
            >
          <MdRoom
           style = {{
            fontSize : 30,
            color : p.username === currentUser ? "slateblue" : "tomato",
            cursor:"pointer"
           }}
           onClick={() => handleMarkerClick(p._id)}
          />
            </Marker>

            {p._id === currentPlacedId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={()=>setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(
                      <AiFillStar style={{ fontSize: "25px", color: "gold"}}/>
                    )}
                  </div>
                  <label>Information</label>
                  <span className="username">Created by <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>

                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          <Popup
          longitude={newPlace.long}
          latitude={newPlace.lat}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={()=>setNewPlace(null)}
        >
          <div>
            <form onSubmit = {handleSubmit}>
              <label>Title</label>
              <input placeholder="Enter a title" 
              onChange={(e)=> setTitle(e.target.value)} 
              />
              <label>Review</label>
              <textarea placeholder="Say us something about this place."
               onChange = {(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange = {(e) => setRating(e.target.value)}>
                <option value = "1">1</option>
                <option value = "2">2</option>
                <option value = "3">3</option>
                <option value = "4">4</option>
                <option value = "5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
            </form>
          </div>
          </Popup> 
        )}
        {currentUser ? (
        <button 
        className="button logout"
        onClick={handleLogout}
        >
        Log out
        </button>
      ) : (
        <div className="buttons">
        <button 
        className="button login" 
        onClick={()=>{
          // if register form is opened then it will close
          setShowRegister(false);
          setShowLogin(true);
        }}
        >
        Login
        </button>
        <button 
        className="button register" 
        onClick={()=>{
          // if login form is opened then it will close
          setShowLogin(false);
          setShowRegister(true);
        }}
        >
        Register
        </button>
        </div>
      )}
      {showRegister && 
      <Register 
      setShowRegister={setShowRegister} 
      />}
      {showLogin && 
      <Login 
      setShowLogin = {setShowLogin} 
      myStorage = {myStorage}
      setCurrentUser = {setCurrentUser}
      />
      }
      </Map>
      
    </div>
  );
}

export default App;

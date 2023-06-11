import { useState, useRef } from "react";
import axios from 'axios';
import { MdRoom , MdCancel } from "react-icons/md";
import { ImCross } from "react-icons/im";
import "./login.css";



export default function Login({setShowLogin,myStorage,setCurrentUser}) {

    const [failure, setFailure] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const User = {
            username: nameRef.current.value,
            password:passwordRef.current.value,
        };

        try {
            const res = await axios.post("/users/login",User);
           
            myStorage.setItem("user",res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
           
        }catch(err) {
            
            setFailure(true);
        }
    }

    return (

        <div className="loginContainer">
            <div className="logo">
                <MdRoom style={{ fontSize: "18px", color: "teal" }} />
                TravelGuide
            </div>
            <form onSubmit = {handleSubmit}>
                {/* whenever those values are changed ref will change  */}
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginBtn">Login</button>
                {failure &&
                    <span className="failure">invalid credentials
                        <ImCross style={{
                            fontSize: "7px",
                            margin: "5px",

                        }}
                        />
                    </span>
                }
            </form>
            <MdCancel 
            className="loginCancel" 
            onClick={()=>setShowLogin(false)}
            />
        </div>
    )
}

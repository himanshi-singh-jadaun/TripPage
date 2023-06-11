import { useState, useRef } from "react";
import axios from 'axios';
import { MdRoom , MdCancel } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import "./register.css";



export default function Register({setShowRegister}) {
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        };

        try {
            await axios.post("/users/register",newUser);
            // if any failure has occured before success 
            // then to remove that failure
            setFailure(false);
            setSuccess(true);
        }catch(err) {
            console.log(err);
            setSuccess(false);
            setFailure(true);
        }
    }

    return (

        <div className="registerContainer">
            <div className="logo">
                <MdRoom style={{ fontSize: "18px", color: "slateblue" }} />
                TravelGuide
            </div>
            <form onSubmit = {handleSubmit}>
                {/* whenever those values are changed ref will change  */}
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="email" placeholder="email" ref={emailRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="registerBtn">Register</button>
                {success &&
                    <span className="success">Successfull ! You can login now
                        <TiTick style={{
                            fontSize: "15px",
                            margin: "4px"
                        }}
                        />
                        
                    </span>
                }
                {failure &&
                    <span className="failure">Something went wrong ! Try again
                        <ImCross style={{
                            fontSize: "7px",
                            margin: "5px",

                        }}
                        />
                    </span>
                }
            </form>
            <MdCancel 
            className="registerCancel" 
            onClick={()=>setShowRegister(false)}
            />
        </div>
    )
}

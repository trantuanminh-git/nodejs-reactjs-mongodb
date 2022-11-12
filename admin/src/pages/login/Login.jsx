import { useContext, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.scss";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined,
    });
    const { user, loading, error, dispatch } = useContext(AuthContext);
    // 2:58:43

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleClick = async e => {
        
        e.preventDefault(); // if we don't ddo that, it will refresh our page
        dispatch({type: "LOGIN_START"})
        try {
            const res = await axios.post("http://localhost:8800/api/auth/login", credentials);
            console.log("minh")
            if(res.data.isAdmin) {
                dispatch({type: "LOGIN_SUCCESS", payload: res.data.details})
                navigate("/");  // it will navigate to homepage at http://localhost:3000/
            } else {
                dispatch({type: "LOGIN_FAILURE", payload: {message: "You are not allowed"}})
            }
        } catch (err) {
            console.log("tran")
            dispatch({type: "LOGIN_FAILURE", payload: err.response.data})
        }
    }

    console.log("user: ", user)

    return (
        <div className="login">
            <div className="lContainer">
                <input
                    type="text"
                    placeholder="username"
                    id="username"
                    onChange={handleChange}
                    className="lInput"
                />
                <input
                    type="password"
                    placeholder="password"
                    id="password"
                    onChange={handleChange}
                    className="lInput"
                />
                <button disabled={loading} onClick={handleClick} className="lButton">Login</button>
                {error && <span>{error.message}</span>}
            </div>
        </div>
    );
};

export default Login;

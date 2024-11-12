import "bootstrap/dist/css/bootstrap.css";
import {useDispatch} from "react-redux";
import {LOGOUT} from "../../redux/actions";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch({type: LOGOUT});
        navigate("/login");
    }, [dispatch, navigate]);
    return null;
};
export default Logout;
import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {LOGIN} from "../redux/actions";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuthenticated, error, isLoggingIn} = useSelector(state => state.auth);
    const initialValues = {
        email: '',
        password: ''
    };
    const validationSchema = Yup.object({
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        password: Yup.string().required('Vui lòng nhập mật khẩu')
    });
    const handleSubmit = (values) => {
        dispatch({type: LOGIN, payload: values});
    };
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
            toast.success("Đăng nhập thành công", {position: "top-right", autoClose: 3000});
        } else if (error) {
            toast.error(error, {position: "top-right", autoClose: 3000});
        }
    }, [isAuthenticated, error, navigate]);
    return (
        <section className="bg-light p-3 p-md-4 p-xl-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xxl-11">
                        <div className="card border-light-subtle shadow-sm">
                            <div className="row g-0">
                                <div className="col-12 col-md-6">
                                    <img className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                                         loading="lazy" src="/408330421c91e9d8d7418d045fe1b649.jpg"
                                         alt="Chào mừng trở lại! Bạn đã được nhớ đến!"/>
                                </div>
                                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                    <div className="col-12 col-lg-11 col-xl-10">
                                        <div className="card-body p-3 p-md-4 p-xl-5">
                                            <h2 className="h4 text-center">Đăng nhập</h2>
                                            <Formik initialValues={initialValues} validationSchema={validationSchema}
                                                    onSubmit={handleSubmit}>
                                                {({isValid}) => (
                                                    <Form>
                                                        <div className="form-floating mb-3">
                                                            <Field type="email" name="email" className="form-control"
                                                                   placeholder="name@example.com"/>
                                                            <label htmlFor="email">Email</label>
                                                            <ErrorMessage name="email" component="div"
                                                                          className="text-danger"/>
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <Field type="password" name="password"
                                                                   className="form-control" placeholder="Mật khẩu"/>
                                                            <label htmlFor="password">Mật khẩu</label>
                                                            <ErrorMessage name="password" component="div"
                                                                          className="text-danger"/>
                                                        </div>
                                                        <button
                                                            className="btn btn-dark btn-lg w-100"
                                                            type="submit"
                                                            disabled={!isValid || isLoggingIn}
                                                        >
                                                            {isLoggingIn ? 'Đang tải...' : 'Đăng nhập'}
                                                        </button>
                                                    </Form>
                                                )}
                                            </Formik>
                                            <p className="mt-5 text-secondary text-center">Đã có tài khoản?</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                isAuthenticated && <Link to={"/logout"}>Đăng xuất</Link>
            }
        </section>
    );
};
export default Login;

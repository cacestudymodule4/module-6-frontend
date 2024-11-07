import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {LOGIN} from "../redux/action";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const error = useSelector(state => state.error);
    const initialValues = {
        email: '',
        password: ''
    };
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required')
    });
    const handleSubmit = (values, {setSubmitting}) => {
        dispatch({type: LOGIN, payload: values});
        setSubmitting(false);
    };
    useEffect(() => {
        if (userLogin?.token) {
            navigate("/");
            toast.success("Đăng nhập thành công", {position: "top-right", autoClose: 3000});
        } else if (error?.error) {
            toast.success("Đăng nhập thất bại", {position: "top-right", autoClose: 3000});
        }
    }, [userLogin, navigate, error]);

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
                                         alt="Welcome back you've been missed!"/>
                                </div>
                                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                    <div className="col-12 col-lg-11 col-xl-10">
                                        <div className="card-body p-3 p-md-4 p-xl-5">
                                            <h2 className="h4 text-center">Login</h2>
                                            <Formik initialValues={initialValues} validationSchema={validationSchema}
                                                    onSubmit={handleSubmit}>
                                                {({isSubmitting, isValid}) => (
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
                                                                   className="form-control" placeholder="Password"/>
                                                            <label htmlFor="password">Password</label>
                                                            <ErrorMessage name="password" component="div"
                                                                          className="text-danger"/>
                                                        </div>
                                                        <button className="btn btn-dark btn-lg w-100" type="submit"
                                                                disabled={!isValid || isSubmitting}>
                                                            {isSubmitting ? 'Loading...' : 'Sign In'}
                                                        </button>
                                                    </Form>
                                                )}
                                            </Formik>
                                            <p className="mt-5 text-secondary text-center">Already have an account?</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;

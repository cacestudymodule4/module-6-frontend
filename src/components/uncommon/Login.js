import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {LOGIN} from "../../redux/actions";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../common/Footer";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuthenticated, error, isLoggingIn} = useSelector(state => state.auth);
    const token = localStorage.getItem('jwtToken');
    const initialValues = {
        username: '',
        password: ''
    };
    const validationSchema = Yup.object({
        username: Yup.string().required('Vui lòng nhập tên người dùng'),
        password: Yup.string().required('Vui lòng nhập mật khẩu')
    });
    const handleSubmit = (values) => {
        dispatch({type: LOGIN, payload: values});
    };
    useEffect(() => {
        if (token) navigate("/home");
        if (isAuthenticated) {
            navigate("/home");
            toast.success("Đăng nhập thành công", {position: "top-right", autoClose: 3000});
        } else if (error) {
            toast.error(error, {position: "top-right", autoClose: 3000});
        }
    }, [isAuthenticated, error, navigate]);
    return (
        <>
            <section className="bg-light p-3 p-md-4 p-xl-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-xxl-11">
                            <div className="card border-light-subtle shadow-sm">
                                <div className="row g-0">
                                    <div className="col-12 col-md-6">
                                        <img className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                                             loading="lazy" src="/94b420d6ca60cf5ea8cd5f312752759b.jpg"
                                             alt="Chào mừng trở lại! Bạn đã được nhớ đến!"/>
                                    </div>
                                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                        <div className="col-12 col-lg-11 col-xl-10">
                                            <div className="card-body p-3 p-md-4 p-xl-5">
                                                <h2 className="text-center py-3 mb-5" style={{fontSize: "2.5rem"}}>Đăng
                                                    nhập</h2>
                                                <Formik initialValues={initialValues}
                                                        validationSchema={validationSchema}
                                                        onSubmit={handleSubmit}>
                                                    {({isValid}) => (
                                                        <Form>
                                                            <div className="form-floating mb-4">
                                                                <Field name="email"
                                                                       className="form-control form-control-lg"
                                                                       placeholder="name@example.com"
                                                                       style={{padding: '1.2rem 1rem'}}
                                                                />
                                                                <label htmlFor="email">Email</label>
                                                                <ErrorMessage name="email" component="div"
                                                                              className="text-danger mt-1"/>
                                                            </div>
                                                            <div className="form-floating mb-4">
                                                                <Field type="password" name="password"
                                                                       className="form-control form-control-lg"
                                                                       placeholder="Mật khẩu"
                                                                       style={{padding: '1.2rem 1rem'}}
                                                                />
                                                                <label htmlFor="password">Mật khẩu</label>
                                                                <ErrorMessage name="password" component="div"
                                                                              className="text-danger mt-1"/>
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
            </section>
            <Footer></Footer>
        </>
    );
};
export default Login;

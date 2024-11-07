import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CHANGE_PASSWORD} from '../redux/actions';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const {error, success, isSubmitting} = useSelector(state => state.passwordChange);
    const validationSchema = Yup.object({
        currentPassword: Yup.string()
            .required("Mật khẩu hiện tại là bắt buộc"),
        newPassword: Yup.string()
            .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
            .required("Mật khẩu mới là bắt buộc"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], "Mật khẩu không khớp")
            .required("Xác nhận mật khẩu là bắt buộc")
    });
    useEffect(() => {
        if (success) {
            toast.success("Đổi mật khẩu thành công", {position: "top-right", autoClose: 3000});
        } else if (error) {
            toast.error(error, {position: "top-right", autoClose: 3000});
        }
    }, [error, success]);
    const handleSubmit = (values) => {
        dispatch({
            type: CHANGE_PASSWORD,
            payload: {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            }
        })
    };
    return (
        <section className="bg-light p-3 p-md-4 p-xl-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xxl-8">
                        <div className="card border-light-subtle shadow-sm">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <h2 className="h4 text-center">Đổi Mật Khẩu</h2>
                                <Formik
                                    initialValues={{currentPassword: '', newPassword: '', confirmPassword: ''}}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({isValid}) => (
                                        <Form>
                                            <div className="form-floating mb-3">
                                                <Field
                                                    type="password"
                                                    name="currentPassword"
                                                    className="form-control"
                                                    placeholder="Mật khẩu hiện tại"
                                                />
                                                <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                                                <ErrorMessage name="currentPassword" component="div"
                                                              className="text-danger"/>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <Field
                                                    type="password"
                                                    name="newPassword"
                                                    className="form-control"
                                                    placeholder="Mật khẩu mới"
                                                />
                                                <label htmlFor="newPassword">Mật khẩu mới</label>
                                                <ErrorMessage name="newPassword" component="div"
                                                              className="text-danger"/>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <Field
                                                    type="password"
                                                    name="confirmPassword"
                                                    className="form-control"
                                                    placeholder="Xác nhận mật khẩu mới"
                                                />
                                                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                                                <ErrorMessage name="confirmPassword" component="div"
                                                              className="text-danger"/>
                                            </div>
                                            <button
                                                className="btn btn-dark btn-lg w-100"
                                                type="submit"
                                                disabled={!isValid || isSubmitting}
                                            >
                                                {isSubmitting ? "Đang thực hiện..." : "Đổi Mật Khẩu"}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default ChangePassword;

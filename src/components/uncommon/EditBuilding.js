import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { NavbarApp } from '../common/Navbar';
import Footer from '../common/Footer';

const ValidateForm = Yup.object().shape({
    name: Yup.string()
        .required('Không được để trống'),

    phoneNumber: Yup.string()
        .test('is-valid-phone', 'Số điện thoại bắt đầu bằng 0 thì gồm 10 số hoặc bằng 84 thì gồm 11 số',
            function (value) {
                if (!value) return false;
                if (/^0\d{9}$/.test(value)) {
                    return true;
                }
                if (/^84\d{9}$/.test(value)) {
                    return true;
                }
                return false;
            }
        )
        .required('Phone number is required'),

    email: Yup.string()
        .email("Email không được chứa dấu")
        .required("Xin vui lòng nhập email")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email phải có định dạng hợp lệ, ví dụ: example@domain.com"
        )
        .max(50, "Email không được vượt quá 50 ký tự"),

    area: Yup.number()
        .integer('Area must be an integer')
        .required('Area is required'),

    address: Yup.string()
        .required('Address is required')
});

export const EditBuilding = () => {
    const navigate = useNavigate();
    const [building, setBuilding] = useState({
        id: '',
        name: '',
        phoneNumber: '',
        email: '',
        area: '',
        address: '',
    });
    const getBuildings = async () => {
        try {
            let config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
            }
            const res = await axios.get(`http://localhost:8080/api/building`, config);
            if (res.status === 200) {
                setBuilding(res.data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBuildings();
    }, []);

    const handleSubmit = async (value) => {
        try {
            let config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            }
            const res = await axios.put(`http://localhost:8080/api/building/edit`, value, config)
            if (res.status === 200) {
                toast.success('Chỉnh sửa thành công! 🦄', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                navigate("/home")
            } else {
                toast.error('Đã có lỗi! 🦄', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <NavbarApp />
            <div className="container mt-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{ color: "white", height: "70px" }}>
                    Chỉnh sửa thông tin toà nhà
                </h2>
                <Formik
                    validationSchema={ValidateForm}
                    enableReinitialize={true}
                    initialValues={{
                        id: building.id,
                        name: building.name,
                        phoneNumber: building.phoneNumber,
                        email: building.email,
                        area: building.area,
                        address: building.address,
                    }}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Tên toà nhà:</label>
                            <Field type="text" id="name" name="name" className="form-control" required />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Số điện thoại:</label>
                            <Field type="text" id="phoneNumber" name="phoneNumber" className="form-control" required />
                            <ErrorMessage name="phoneNumber" component="div" style={{ color: 'red' }} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <Field type="email" id="email" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="area" className="form-label">Diện tích(m<sup>2</sup>):</label>
                            <Field type="number" id="area" name="area" className="form-control" />
                            <ErrorMessage name="area" component="div" style={{ color: 'red' }} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Địa chỉ:</label>
                            <Field type="text" id="address" name="address" className="form-control" />
                            <ErrorMessage name="address" component="div" style={{ color: 'red' }} />
                        </div>

                        <div className="mb-3">
                            <Button style={{ width: "10%", marginLeft: "90%" }} type="submit" className="form-control" variant="success">Submit</Button>
                        </div>
                    </Form>
                </Formik>
            </div>
            <Footer />
        </>
    );
}


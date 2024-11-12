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
    // id: Yup.string()
    //     .matches(/^BO-\d{4}$/, "Mã sách phải có định dạng BO-XXXX (X là các số)")
    //     .required("Trường không được để trống"),
    // name: Yup.string()
    //     .max(100, "Tên sách không được dài quá 100 ký tự")
    //     .required("Trường không được để trống"),
    // dateIn: Yup.date()
    //     .max(new Date(), "Ngày nhập không được lớn hơn ngày hiện tại")
    //     .required("Trường không được để trống"),
    // quantity: Yup.number()
    //     .integer("Số lượng phải là số nguyên")
    //     .min(1, "Số lượng phải lớn hơn 0")
    //     .required("Trường không được để trống")
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
                            <Field type="number" id="phoneNumber" name="phoneNumber" className="form-control" required />
                            <ErrorMessage name="phoneNumber" component="div" style={{ color: 'red' }} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <Field type="email" id="email" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="area" className="form-label">Diện tích:</label>
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


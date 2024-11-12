import React, {useState, useEffect} from "react";
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

const EditStaff = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/staff/${id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            })
            .then((response) => {
                setStaffData(response.data);
            })
            .catch((error) => toast.error("Lỗi khi tải thông tin nhân viên"));
    }, [id]);

    const validationSchema = Yup.object({
        name: Yup.string().required("Tên không được để trống"),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Email không được để trống"),
        phone: Yup.string()
            .matches(/^(09|08)[0-9]{8}$/, "Số điện thoại không hợp lệ")
            .required("Số điện thoại không được để trống"),
        address: Yup.string().required("Địa chỉ không được để trống"),
        position: Yup.string().required("Vị trí không được để trống"),
        salary: Yup.number().required("Lương không được để trống"),
        birthDate: Yup.date().required("Ngày sinh không được để trống"),
        startDate: Yup.date().required("Ngày làm việc không được để trống"),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/staff/edit/${id}`, values, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            toast.success("Cập nhật nhân viên thành công!");
            navigate("/staff/list");
        } catch (error) {
            toast.error("Cập nhật nhân viên thất bại!");
        }
    };

    if (!staffData) return <div>Loading...</div>;

    return (<>
        <NavbarApp/>
        <div className="container my-5 rounded mx-auto p-4" style={{minHeight: '45vh'}}>
            <h3 className="text-center text-white py-3 bg-success rounded mb-5" style={{fontSize: '2.25rem'}}>
                Chỉnh sửa nhân viên
            </h3>
            <Formik
                initialValues={{
                    name: staffData?.name || '',
                    birthDate: staffData?.birthDate || '',
                    address: staffData?.address || '',
                    phone: staffData?.phone || '',
                    email: staffData?.email || '',
                    position: staffData?.position || '',
                    salary: staffData?.salary || '',
                    startDate: staffData?.startDate || '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <FormikForm>
                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Tên</label>
                        <Field type="text" name="name" className="form-control form-control-lg"/>
                        <ErrorMessage name="name" component="div" className="text-danger small"/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Ngày sinh</label>
                        <Field type="date" name="birthDate" className="form-control form-control-lg"/>
                        <ErrorMessage name="birthDate" component="div" className="text-danger small"/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Địa chỉ</label>
                        <Field type="text" name="address" className="form-control form-control-lg"/>
                        <ErrorMessage name="address" component="div" className="text-danger small"/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Điện thoại</label>
                        <Field type="text" name="phone" className="form-control form-control-lg"/>
                        <ErrorMessage name="phone" component="div" className="text-danger small"/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Email</label>
                        <Field type="email" name="email" className="form-control form-control-lg"/>
                        <ErrorMessage name="email" component="div" className="text-danger small"/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Lương</label>
                        <Field type="number" name="salary" className="form-control form-control-lg"/>
                        <ErrorMessage name="salary" component="div" className="text-danger small"/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Ngày làm việc</label>
                        <Field type="date" name="startDate" className="form-control form-control-lg"/>
                        <ErrorMessage name="startDate" component="div" className="text-danger small"/>
                    </div>

                    <div className="mb-2">
                        <label className="form-label" style={{fontSize: '1.2rem'}}>Vị trí</label>
                        <Field type="text" name="position" className="form-control form-control-lg"/>
                        <ErrorMessage name="position" component="div" className="text-danger small"/>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-success btn-lg me-2"
                            onClick={() => navigate("/staff/list")}>
                            Trở lại
                        </button>
                        <button type="submit" className="btn btn-success btn-lg">Hoàn Thành</button>
                    </div>

                </FormikForm>
            </Formik>

            <ToastContainer position="top-right" autoClose={5000}/>
        </div>
        <Footer/>
    </>);
};

export default EditStaff;
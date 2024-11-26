import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import {useNavigate} from "react-router-dom";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";

const AddStaff = () => {
        const token = localStorage.getItem("jwtToken");
        const navigate = useNavigate();
        const [showModal, setShowModal] = useState(false);
        const [newStaff, setNewStaff] = useState(null);
        const userRole = localStorage.getItem("userRole");
        const [positions, setPositions] = useState([]);

        const initialValues = {
            name: "",
            gender: true,
            birthday: "",
            address: "",
            phone: "",
            email: "",
            identification: "",
            salary: "",
            startDate: "",
            positionId: ""
        };

        useEffect(() => {
            if (!token) navigate("/login")
            if (userRole !== "ADMIN") {
                navigate("/home")
            }
            const fetchPositions = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/positions', {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    setPositions(response.data);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu Position:', error);
                    toast.error('Không thể tải danh sách bộ phận.');
                }
            };
            fetchPositions();
        }, [token]);

        const validationSchema = Yup.object({
            codeStaff: Yup.string()
                .required("Xin hãy nhập mã NV")
                .matches(/^NV-\d{3}$/, "Mã nhân viên phải có định dạng 'NV-XXX', trong đó XXX là 3 chữ số"),

            name: Yup.string()
                .required("Xin vui lòng nhập tên")
                .min(1, "Tên phải có ít nhất 1 ký tự")
                .max(50, "Tên không được vượt quá 50 ký tự"),

            birthday: Yup.date()
                .required("Xin vui lòng nhập ngày sinh")
                .max(new Date(), "Ngày sinh không được ở tương lai"),

            address: Yup.string()
                .required("Xin vui lòng nhập địa chỉ")
                .min(3, "Địa chỉ phải có ít nhất 3 ký tự"),

            phone: Yup.string()
                .required("Xin vui lòng nhập số điện thoại")
                .matches(/^(09|08)[0-9]{8}$/, "Số điện thoại phải bắt đầu bằng 09 hoặc 08 và có đúng 10 chữ số"),

            email: Yup.string()
                .email("Bạn nhập sai định dạng rồi, ví dụ: example@gmail.com")
                .required("Xin vui lòng nhập email")
                .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email phải có định dạng hợp lệ, ví dụ: example@domain.com")
                .max(50, "Email không được vượt quá 50 ký tự"),

            salary: Yup.number()
                .required("Xin vui lòng nhập lương")
                .positive("Lương phải là số dương")
                .min(1000, "Lương thấp nhất là 1000 VNĐ")
                .max(100000000, "Lương không được vượt quá 100 triệu VNĐ"),

            startDate: Yup.date()
                .required("Xin vui lòng nhập ngày bắt đầu làm việc")
                .max(new Date(), "Ngày bắt đầu không được ở tương lai"),

            positionId: Yup.string().required("Bộ phận là bắt buộc"),

            identification: Yup.string()
                .required("Xin vui lòng điền CCCD/CMND")
                .matches(/^\d{9}$|^\d{10}$/, "Số CCCD/CMND phải có 9 hoặc 12 chữ số")
        });


        const addEmployee = async (values) => {
            try {
                const response = await axios.post('http://localhost:8080/api/staff/add', values, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                });

                if (response.status === 200) {
                    toast.success("Nhân viên đã được khôi phục thành công");
                    setNewStaff({email: values.email, password: "123456789", status: 200});
                } else if (response.status === 201) {
                    toast.success("Nhân viên mới đã được thêm thành công!!!");
                    setNewStaff({email: values.email, password: "123456789", status: 201});
                }
                setShowModal(true);
                setTimeout(() => {
                    navigate("/staff/list");
                }, 5000);
            } catch (error) {
                console.error("Lỗi thêm nhân viên: ", error.response || error);
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data);
                } else {
                    toast.error("Lỗi hệ thống, xin bạn hãy kiểm tra lại");
                }
            }
        };

        const handleSalaryChange = (e, setFieldValue) => {
            const rawValue = e.target.value.replace(/\D/g, "");
            setFieldValue("salary", rawValue);
        };

        const formatSalaryDisplay = (value) => {
            return new Intl.NumberFormat('vi-VN').format(value || 0);
        };

        return (<>
            <NavbarApp/>
            <div className="container my-5 rounded p-4" style={{maxWidth: '800px'}}>
                <h3 className="text-center text-white py-3 bg-success rounded mb-5" style={{fontSize: '2.15rem'}}>
                    Thêm Nhân Viên Mới
                </h3>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => addEmployee(values)}
                >
                    <FormikForm>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-2">
                                    <label className="form-label" style={{fontSize: '1.2rem'}}>Mã nhân viên</label>
                                    <Field type="text" name="codeStaff" className="form-control form-control-lg"/>
                                    <ErrorMessage name="codeStaff" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Họ và Tên</label>
                                    <Field type="text" name="name" className="form-control form-control-lg"/>
                                    <ErrorMessage name="name" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Ngày sinh</label>
                                    <Field type="date" name="birthday" className="form-control form-control-lg"/>
                                    <ErrorMessage name="birthday" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Email</label>
                                    <Field type="email" name="email" className="form-control form-control-lg"/>
                                    <ErrorMessage name="email" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>CCCN/CMDN</label>
                                    <Field type="text" name="identification" className="form-control form-control-lg"/>
                                    <ErrorMessage name="identification" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Số điện thoại</label>
                                    <Field type="text" name="phone" className="form-control form-control-lg"/>
                                    <ErrorMessage name="phone" component="div" className="text-danger small"/>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Địa chỉ</label>
                                    <Field type="text" name="address" className="form-control form-control-lg"/>
                                    <ErrorMessage name="address" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Lương</label>
                                    <Field name="salary">
                                        {({field, form}) => (<div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                {...field}
                                                value={formatSalaryDisplay(field.value)}
                                                onChange={(e) => handleSalaryChange(e, form.setFieldValue)}
                                                placeholder="Nhập lương"
                                            />
                                            <span className="input-group-text">VNĐ</span>
                                        </div>)}
                                    </Field>
                                    <ErrorMessage name="salary" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Ngày làm việc</label>
                                    <Field type="date" name="startDate" className="form-control form-control-lg"/>
                                    <ErrorMessage name="startDate" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-2">
                                    <label className="form-label" style={{fontSize: "1.1rem"}}>Bộ phận</label>
                                    <Field as="select" name="positionId" className="form-control form-control-lg">
                                        <option value="">Chọn bộ phận</option>
                                        {positions.map((position) => (
                                            <option key={position.id} value={position.id}>
                                                {position.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="positionId" component="div" className="text-danger small"/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{fontSize: '1.1rem'}}>Giới tính</label>
                                    <Field as="select" name="gender" className="form-select form-select-lg">
                                        <option value={true}>Nam</option>
                                        <option value={false}>Nữ</option>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <button
                                type="button"
                                className="btn btn-outline-success btn-lg me-2"
                                onClick={() => navigate("/staff/list")}>
                                <i className="bi bi-arrow-left-circle me-2"></i>
                                Quay lại
                            </button>

                            <button type="submit" className="btn btn-outline-success btn-lg">
                                Thêm <i className="bi bi-plus-circle"></i>
                            </button>
                        </div>
                    </FormikForm>
                </Formik>

                {/*{newStaff && newStaff.status === 409 && (*/}
                {/*    <div className="modal fade show d-block" tabIndex="-1" role="dialog"*/}
                {/*         style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>*/}
                {/*        <div className="modal-dialog modal-dialog-centered" role="document">*/}
                {/*            <div className="modal-content">*/}
                {/*                <div className="modal-header">*/}
                {/*                    <h5 className="modal-title">Thông tin nhân viên đã tồn tại</h5>*/}
                {/*                    <button type="button" className="btn-close"*/}
                {/*                            onClick={() => setShowModal(false)}></button>*/}
                {/*                </div>*/}
                {/*                <div className="modal-body">*/}
                {/*                    <p><strong>Họ và Tên:</strong> {newStaff.name}</p>*/}
                {/*                    <p><strong>Email:</strong> {newStaff.email}</p>*/}
                {/*                    <p><strong>Số điện thoại:</strong> {newStaff.phone}</p>*/}
                {/*                    <p><strong>CCCD/CMND:</strong> {newStaff.identification}</p>*/}
                {/*                    <p><strong>Trạng thái:</strong> Đã bị vô hiệu hóa</p>*/}
                {/*                    <p>Bạn có muốn kích hoạt lại nhân viên này không?</p>*/}
                {/*                </div>*/}
                {/*                <div className="modal-footer">*/}
                {/*                    <button type="button" className="btn btn-success"*/}
                {/*                            onClick={() => restoreStaff(newStaff.id)}>*/}
                {/*                        Kích hoạt lại*/}
                {/*                    </button>*/}
                {/*                    <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>*/}
                {/*                        Hủy bỏ*/}
                {/*                    </button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}

                {showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog"
                         style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 className="text-center bg-success py-3 mb-3">Thông tin tài khoản</h3>
                                    <button type="button" className="btn-close"
                                            onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Tài khoản:</strong> {newStaff.email}</p>
                                    <p><strong>Mật khẩu:</strong> {newStaff.password}</p>
                                    <p>{newStaff && newStaff.status === 200 ? "Tài khoản đã được khôi phục." : "Đây là mật khẩu mặc định. Bạn nên đổi để bảo mật hơn."}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" onClick={() => navigate('/logout')}>
                                        OK
                                    </button>
                                    <button type="button" className="btn btn-primary"
                                            onClick={() => navigate('/staff/password')}>
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer/>
        </>);
    }
;

export default AddStaff;
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../assets/css/CustomerList.css';
import Modal from 'react-modal';
import {useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

Modal.setAppElement('#root');
const customerSchema = Yup.object().shape({
    name: Yup.string().required("Tên khách hàng là bắt buộc"),
    birthday: Yup.date().required("Ngày sinh là bắt buộc"),
    identification: Yup.string()
        .matches(/^[0-9]{9,12}$/, "CMND phải chứa 9-12 chữ số")
        .required("CMND là bắt buộc"),
    address: Yup.string().required("Địa chỉ là bắt buộc"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại phải chứa 10 chữ số")
        .required("Số điện thoại là bắt buộc"),
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
    company: Yup.string().required("Công ty là bắt buộc"),
});

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editedCustomer, setEditedCustomer] = useState({});
    const [errors, setErrors] = useState({});
    useEffect(() => {
        fetchCustomers();
    }, []);
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/customers', {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setCustomers(response.data);
        } catch (error) {
            console.error('Có lỗi khi lấy danh sách khách hàng:', error);
        }
    };
    const navigate = useNavigate();
    const handleNavigateToAddCustomer = () => {
        navigate('/customer/add');
    };
    const handleDeleteCustomer = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/customers/delete/${customerToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            setCustomers(customers.filter(customer => customer.id !== customerToDelete.id));
            closeModal();
        } catch (error) {
            console.error('Có lỗi khi xóa khách hàng:', error);
        }
    };
    const handleOpenModal = (customer) => {
        setCustomerToDelete(customer);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setCustomerToDelete(null);
    };
    const handleEditClick = (customer) => {
        setEditingCustomer(customer.id);
        setEditedCustomer(customer);
    };
    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditedCustomer({
            ...editedCustomer,
            [name]: value
        });
    };
    const handleSaveEdit = async () => {
        try {
            await customerSchema.validate(editedCustomer, {abortEarly: false});
            const response = await axios.put(
                `http://localhost:8080/api/customers/update/${editingCustomer}`,
                editedCustomer,
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                }
            );
            if (response.status === 200) {
                setCustomers(customers.map(customer => customer.id === editingCustomer ? response.data : customer));
                setEditingCustomer(null);
                setErrors({});
            }
        } catch (error) {
            if (error.inner) {
                // Xử lý lỗi Yup
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else if (error.response && error.response.status === 400) {
                // Lỗi từ backend (vd: email hoặc CMND đã tồn tại)
                setErrors({api: error.response.data});
            } else {
                console.error('Có lỗi khi cập nhật khách hàng:', error);
            }
        }
    };
    const handleCancelEdit = () => {
        setEditingCustomer(null);
        setEditedCustomer({});
        setErrors({});
    };
    return (
        <div className="customer-list">
            <div className="customer-list__title">
                DANH SÁCH KHÁCH HÀNG
            </div>
            <div className="customer-list__add-btn">
                <button onClick={handleNavigateToAddCustomer}>Thêm mới</button>
            </div>
            <div className="customer-list__table-container">
                <table className="customer-list__table">
                    <thead className="customer-list__thead">
                    <tr>
                        <th className="customer-list__th">STT</th>
                        <th className="customer-list__th">Tên Khách Hàng</th>
                        <th className="customer-list__th">Ngày sinh</th>
                        <th className="customer-list__th">Số chứng minh thư</th>
                        <th className="customer-list__th">Địa chỉ</th>
                        <th className="customer-list__th">Số điện thoại</th>
                        <th className="customer-list__th">Email</th>
                        <th className="customer-list__th">Công ty</th>
                        <th colSpan={2} className="customer-list__th">Hành Động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer, index) => (
                        <tr key={customer.id}>
                            <td className="customer-list__td">{index + 1}</td>
                            {editingCustomer === customer.id ? (
                                <>
                                    <td className="customer-list__td">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedCustomer.name}
                                            onChange={handleEditChange}
                                        />
                                        {errors.name && <div className="customer-list__error">{errors.name}</div>}
                                    </td>
                                    <td className="customer-list__td">
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={editedCustomer.birthday}
                                            onChange={handleEditChange}
                                        />
                                        {errors.birthday &&
                                            <div className="customer-list__error">{errors.birthday}</div>}
                                    </td>
                                    <td className="customer-list__td">
                                        <input
                                            type="text"
                                            name="identification"
                                            value={editedCustomer.identification}
                                            onChange={handleEditChange}
                                        />
                                        {errors.identification &&
                                            <div className="customer-list__error">{errors.identification}</div>}
                                    </td>
                                    <td className="customer-list__td">
                                        <input
                                            type="text"
                                            name="address"
                                            value={editedCustomer.address}
                                            onChange={handleEditChange}
                                        />
                                        {errors.address && <div className="customer-list__error">{errors.address}</div>}
                                    </td>
                                    <td className="customer-list__td">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editedCustomer.phone}
                                            onChange={handleEditChange}
                                        />
                                        {errors.phone && <div className="customer-list__error">{errors.phone}</div>}
                                    </td>
                                    <td className="customer-list__td">
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedCustomer.email}
                                            onChange={handleEditChange}
                                        />
                                        {errors.email && <div className="customer-list__error">{errors.email}</div>}
                                    </td>
                                    <td className="customer-list__td">
                                        <input
                                            type="text"
                                            name="company"
                                            value={editedCustomer.company}
                                            onChange={handleEditChange}
                                        />
                                        {errors.company && <div className="customer-list__error">{errors.company}</div>}
                                    </td>
                                    <td className="customer-list__td">
                                        <button className="customer-list__save-btn" onClick={handleSaveEdit}>Lưu
                                        </button>
                                    </td>
                                    <td className="customer-list__td">
                                        <button className="customer-list__cancel-btn" onClick={handleCancelEdit}>Hủy
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="customer-list__td">{customer.name}</td>
                                    <td className="customer-list__td">{customer.birthday}</td>
                                    <td className="customer-list__td">{customer.identification}</td>
                                    <td className="customer-list__td">{customer.address}</td>
                                    <td className="customer-list__td">{customer.phone}</td>
                                    <td className="customer-list__td">{customer.email}</td>
                                    <td className="customer-list__td">{customer.company}</td>
                                    <td className="customer-list__td">
                                        <button className="customer-list__edit-btn"
                                                onClick={() => handleEditClick(customer)}>Sửa
                                        </button>
                                    </td>
                                    <td className="customer-list__td">
                                        <button className="customer-list__delete-btn"
                                                onClick={() => handleOpenModal(customer)}>Xóa
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Modal Confirm Delete */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Xác nhận xóa khách hàng">
                <h2>Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa khách hàng {customerToDelete?.name}?</p>
                <div>
                    <button onClick={handleDeleteCustomer} style={{background: 'red', color: 'white'}}>Xóa</button>
                    <button onClick={closeModal}>Hủy</button>
                </div>
            </Modal>
            {/* Hiển thị lỗi từ server nếu có */}
            {errors.api && <div className="customer-list__api-error">{errors.api}</div>}
        </div>
    );
}

export default CustomerList

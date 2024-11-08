import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './CustomerList.css';
import {FaSearch} from "react-icons/fa";
import {TbReload} from "react-icons/tb";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

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

    const handleAddCustomer = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/customers', newCustomer, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setCustomers([...customers, response.data]);
            setNewCustomer({});
        } catch (error) {
            console.error('Có lỗi khi thêm khách hàng:', error);
        }
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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewCustomer({
            ...newCustomer,
            [name]: value,
        });
    };

    return (
        <div className="customer-list">
            <div className="customer-list-title">
                DANH SÁCH KHÁCH HÀNG
            </div>
            <div className="add-customer">
                <button onClick={handleAddCustomer}>Thêm mới</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Khách Hàng</th>
                        <th>Ngày sinh</th>
                        <th>Số chứng minh thư</th>
                        <th>Địa chỉ</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Công ty</th>
                        <th colSpan={3}>Hành Động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer, index) => (
                        <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td>{customer.name}</td>
                            <td>{customer.birthday}</td>
                            <td>{customer.identification}</td>
                            <td>{customer.address}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td>
                                <button className="edit">Sửa</button>
                            </td>
                            <td>
                                <button className="delete" onClick={() => handleOpenModal(customer)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button>Trang đầu</button>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>Trang cuối</button>
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
        </div>
    );
}

export default CustomerList;

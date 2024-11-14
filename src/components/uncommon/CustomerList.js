import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap'; // Import Modal và Button từ react-bootstrap
import {useNavigate} from "react-router-dom";
import '../../assets/css/CustomerList.css';
import {FaSearch} from "react-icons/fa";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import * as Yup from 'yup';
import {TbReload} from "react-icons/tb";
import {toast} from "react-toastify";
import moment from "moment/moment";

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
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editedCustomer, setEditedCustomer] = useState({});
    const [errors, setErrors] = useState({});
    const [searchName, setSearchName] = useState('');
    const [searchIdentification, setSearchIdentification] = useState('');
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/customers/list', {
                params: {
                    page: page - 1,
                    size: pageSize,
                },
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            console.log("Dữ liệu khách hàng:", response.data);
            setCustomers(response.data.content);
            setFilteredCustomers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Có lỗi khi lấy danh sách khách hàng:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();  // Gọi hàm fetch khi component mount
    }, [page]);

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
            setFilteredCustomers(filteredCustomers.filter(customer => customer.id !== customerToDelete.id));
            closeModal();
            toast.success("Xóa thành công")
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
                `http://localhost:8080/api/customers/update/${editedCustomer.id}`,
                editedCustomer,
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                }
            );

            if (response.status === 200) {
                setCustomers(customers.map(customer => customer.id === editedCustomer.id ? response.data : customer));
                setFilteredCustomers(filteredCustomers.map(customer => customer.id === editedCustomer.id ? response.data : customer));
                setEditingCustomer(null);
                setErrors({});
                toast.success("Chỉnh sửa thành công");
            }
        } catch (error) {
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
                toast.error("Chỉnh sửa thất bại. Vui lòng kiểm tra lại thông tin.");
            } else if (error.response && error.response.data) {
                toast.error(`${error.response.data.message || error.response.data}`);
                setErrors({api: error.response.data});
            } else {
                console.error('Có lỗi khi cập nhật khách hàng:', error);
                toast.error("Đã xảy ra lỗi không xác định khi chỉnh sửa.");
            }
        }
    };


    const handleCancelEdit = () => {
        setEditingCustomer(null);
        setEditedCustomer({});
        setErrors({});
    };

    const handleCombinedSearch = async (page = 0) => {
        try {
            const response = await axios.get('http://localhost:8080/api/customers/search', {
                params: {
                    name: searchName,
                    identification: searchIdentification,
                    page: page,
                    size: pageSize,
                },
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setFilteredCustomers(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(page);
        } catch (error) {
            console.error('Có lỗi khi tìm kiếm khách hàng:', error);
        }
    };

    const handleReload = () => {
        fetchCustomers(page);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    return (
        <>
            <NavbarApp/>
            <div className="customer-list container mt-5">
                <h2 className="text-center mb-5 bg-success text-white py-4">Danh sách khách hàng</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button className="btn btn-success" onClick={handleNavigateToAddCustomer}>Thêm mới</button>
                    <button className="btn btn-success" onClick={handleReload}><TbReload/></button>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control mr-2"
                            placeholder="Tìm kiếm theo tên"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control mr-2"
                            placeholder="Tìm kiếm theo CMND"
                            value={searchIdentification}
                            onChange={(e) => setSearchIdentification(e.target.value)}
                        />
                        <button className="btn btn-success customer-id-search" onClick={() => handleCombinedSearch(0)}>
                            <FaSearch/>
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered border-success">
                        <thead className="table-success">
                        <tr>
                            <th>STT</th>
                            <th>Tên Khách Hàng</th>
                            <th>Ngày sinh</th>
                            <th>Số chứng minh thư</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Công ty</th>
                            <th colSpan={2}>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer, index) => (
                                <tr key={customer.id}>
                                    <td>{(page - 1) * pageSize + index + 1}</td>
                                    {editingCustomer === customer.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editedCustomer.name}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                                {errors.name && <div className="text-danger">{errors.name}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    value={moment(editedCustomer.birthday).format("YYYY-MM-DD")}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                                {errors.birthday &&
                                                    <div className="text-danger">{errors.birthday}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="identification"
                                                    value={editedCustomer.identification}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                                {errors.identification &&
                                                    <div className="text-danger">{errors.identification}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={editedCustomer.address}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                                {errors.address && <div className="text-danger">{errors.address}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={editedCustomer.phone}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                                {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={editedCustomer.email}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                                {errors.email && <div className="text-danger">{errors.email}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={editedCustomer.company}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                                {errors.company && <div className="text-danger">{errors.company}</div>}
                                            </td>
                                            <td>
                                                <button className="btn btn-success" onClick={handleSaveEdit}>Lưu
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger" onClick={handleCancelEdit}>Hủy
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{customer.name}</td>
                                            <td>{moment(customer.birthday).format('DD-MM-YYYY')}</td>
                                            <td>{customer.identification}</td>
                                            <td>{customer.address}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.company}</td>
                                            <td>
                                                <button className="btn btn-warning"
                                                        onClick={() => handleEditClick(customer)}>Sửa
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger"
                                                        onClick={() => handleOpenModal(customer)}>Xóa
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">Không có khách hàng nào</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between" style={{marginBottom: "20px"}}>
                    <button className="btn btn-outline-success" onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}>Trang trước
                    </button>
                    <span>Trang {page} / {totalPages}</span>
                    <button className="btn btn-outline-success" onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}>Trang sau
                    </button>
                </div>
            </div>
            <Modal show={isModalOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa khách hàng
                    <span className="text-danger"> {customerToDelete?.name}</span>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Hủy</Button>
                    <Button variant="danger" onClick={handleDeleteCustomer}>Xóa</Button>
                </Modal.Footer>
            </Modal>
            <Footer/>
        </>
    );
}

export default CustomerList;

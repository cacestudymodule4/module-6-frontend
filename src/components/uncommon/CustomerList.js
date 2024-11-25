import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import '../../assets/css/CustomerList.css';
import {FaRedo, FaSearch} from "react-icons/fa";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import {toast} from "react-toastify";
import moment from "moment/moment";
import Pagination from "react-bootstrap/Pagination";

function CustomerList() {
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const [customer, setCustomer] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchIdentification, setSearchIdentification] = useState('');
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
        return match ? `${match[1]} ${match[2]} ${match[3]}` : phoneNumber;
    };
    const formatIdentification = (identification) => {
        const cleaned = ('' + identification).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3,4})(\d{3,4})(\d{3,4})$/);
        return match ? `${match[1]} ${match[2]} ${match[3]}` : identification;
    };
    const displayGender = (gender) => {
        return gender ? "Nam" : "Nữ";
    };

    const fetchCustomers = async () => {
        try {
            const newCustomer = JSON.parse(localStorage.getItem("newCustomer"));
            const response = await axios.get('http://localhost:8080/api/customers/list', {
                params: {
                    page: page - 1,
                    size: pageSize,
                },
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            let customerList = response.data.content;
            if (newCustomer) {
                customerList = [newCustomer, ...customerList];
                localStorage.removeItem("newCustomer");
            }
            setCustomer(customerList);
            setFilteredCustomers(customerList);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Có lỗi khi lấy danh sách khách hàng:', error);
        }
    };

    useEffect(() => {
        if (!token) navigate("/login")
        if (searchName || searchIdentification) {
            handleCombinedSearch(page - 1);
        } else {
            fetchCustomers(page);
        }
    }, [page]);


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
            toast.success("Xóa thành công");
            setCustomerToDelete(null);
            setIsModalOpen(false);

            if (filteredCustomers.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchCustomers(page - 1, {name: searchName, identification: searchIdentification});
            }
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


    const handleCombinedSearch = async (newPage = 0) => {
        try {
            const response = await axios.get('http://localhost:8080/api/customers/search', {
                params: {
                    name: searchName,
                    identification: searchIdentification,
                    page: newPage,
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
        setPage(1);
        setSearchName('');
        setSearchIdentification('');
        fetchCustomers();
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }
    return (
        <>
            <NavbarApp/>
            <div className="customer-list container-fluid my-5 p-4 rounded">
                <h2 className="text-center mb-5 bg-success text-white py-3 rounded"
                    style={{fontSize: '2.15rem'}}>
                    Danh sách khách hàng
                </h2>
                <div className="d-flex justify-content-center align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Tìm kiếm theo tên"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{maxWidth: "250px"}}
                    />
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Tìm kiếm theo CMND"
                        value={searchIdentification}
                        onChange={(e) => setSearchIdentification(e.target.value)}
                        style={{maxWidth: "250px"}}
                    />
                    <button className="btn btn-success customer-id-search" onClick={() => handleCombinedSearch(0)}>
                        <FaSearch/>
                    </button>
                </div>
                <div className="d-flex mb-4">
                    <button
                        className="btn btn-success me-2"
                        style={{fontSize: '1.1rem', padding: '0.75rem 2rem', marginTop: '1rem'}}
                        onClick={handleNavigateToAddCustomer}
                    >
                        <i className="bi bi-plus-circle" style={{marginRight: '8px'}}></i>
                        Thêm mới
                    </button>

                    <button
                        className="btn btn-secondary me-2"
                        style={{fontSize: '1.1rem', padding: '0.75rem 2rem', marginTop: '1rem'}}
                        onClick={handleReload}
                    >
                        <FaRedo/>
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered border-success">
                        <thead className="table-success text-center text-white custom-table">
                        <tr>
                            <th>STT</th>
                            <th>Tên Khách Hàng</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Số chứng minh thư</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Công ty</th>
                            <th>Trạng thái</th>
                            <th colSpan={2}>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers
                                .map((customer, index) => (
                                    <tr key={customer.id} className={customer.isNew ? "customer-highlight" : ""}>
                                        <td>{(page - 1) * pageSize + index + 1}</td>
                                        <td>{customer.name}</td>
                                        <td>{moment(customer.birthday).format("DD-MM-YYYY")}</td>
                                        <td>{displayGender(customer.gender)}</td>
                                        <td>{formatIdentification(customer.identification)}</td>
                                        <td>{customer.address}</td>
                                        <td>{formatPhoneNumber(customer.phone)}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.company}</td>
                                        <td>
                                            {customer.isDisabled ? (
                                                <span style={{color: "red"}}>Đã vô hiệu hóa</span>
                                            ) : (
                                                <span style={{color: "green"}}>Đang hoạt động</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => navigate(`/customer/edit/${customer.id}`)}
                                            >
                                                Sửa
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleOpenModal(customer)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    Không có khách hàng nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                        </Pagination.Prev>
                        {[...Array(totalPages).keys()].map((pageNumber) => (
                            <Pagination.Item
                                key={pageNumber + 1}
                                active={pageNumber + 1 === page}
                                onClick={() => handlePageChange(pageNumber + 1)}
                            >
                                {pageNumber + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                        </Pagination.Next>
                    </Pagination>
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

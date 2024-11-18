import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { NavbarApp } from "../common/Navbar";
import Footer from "../common/Footer";
import { FaSearch } from 'react-icons/fa';
import { TbReload } from 'react-icons/tb';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [searchName, setSearchName] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', price: '', unit: '' });
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        fetchServices(currentPage); // When page changes, fetch services for that page
    }, [currentPage]);

    const fetchServices = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/services/list`, {
                params: { page, size: pageSize, name: searchName },
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            setServices(response.data.content);
            setTotalPages(response.data.totalPages);
            if (response.data.content.length === 0 && searchName) {
                toast.info("Không tìm thấy dịch vụ phù hợp.");
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách dịch vụ:", error);
            toast.error("Không thể tải dữ liệu dịch vụ.");
        }
    };

    const handleSearch = () => {
        fetchServices(0); // Reset to page 0 when searching
    };

    const handleReload = () => {
        setSearchName('');
        fetchServices(0);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const startEditing = (index, service) => {
        setEditIndex(index);
        setEditFormData({ name: service.name, price: service.price, unit: service.unit });
    };

    const cancelEditing = () => {
        setEditIndex(null);
        setEditFormData({ name: '', price: '', unit: '' });
    };

    const saveEdit = async (serviceId) => {
        try {
            await axios.put(`http://localhost:8080/api/services/update/${serviceId}`, editFormData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            toast.success("Cập nhật thành công");
            fetchServices(currentPage);
            cancelEditing();
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
            const errorMessage = error.response?.data || "Cập nhật thất bại";
            toast.error(errorMessage);
        }
    };

    const openDeleteModal = (serviceId) => {
        setServiceToDelete(serviceId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setServiceToDelete(null);
        setShowDeleteModal(false);
    };

    const confirmDeleteService = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/services/delete/${serviceToDelete}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            toast.success("Xóa thành công");
            fetchServices(currentPage);
        } catch (error) {
            console.error("Lỗi khi xóa dịch vụ:", error);
            toast.error("Xóa thất bại");
        }
        closeDeleteModal();
    };

    const handleNavigateToAddService = () => {
        navigate('/service/add');
    };

    const handleViewService = (serviceId) => {
        navigate(`/service/detail/${serviceId}`);
    };

    return (
        <>
            <NavbarApp />
            <div className="service-list container mt-5">
                <h2 className="text-center mb-5 bg-success text-white py-4">Danh sách dịch vụ</h2>

                <div className="d-flex mb-3">
                    <button className="btn btn-success" onClick={handleNavigateToAddService}>Thêm mới</button>
                    <button className="btn btn-secondary ms-2" onClick={handleReload}><TbReload /> Tải lại</button>
                </div>

                <div className="d-flex justify-content-center align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Tìm kiếm theo tên dịch vụ"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <button className="btn btn-success ms-2" onClick={handleSearch}>
                        <FaSearch /> Tìm kiếm
                    </button>
                </div>

                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead className="table-success">
                        <tr className="text-center">
                            <th>STT</th>
                            <th>Tên Dịch Vụ</th>
                            <th>Giá</th>
                            <th>Đơn vị</th>
                            <th colSpan={3}>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {services.length > 0 ? (
                            services.map((service, index) => (
                                <tr key={service.id} className="text-center">
                                    <td>{(currentPage * pageSize) + index + 1}</td>
                                    <td>{service.name}</td>
                                    <td>{service.price}</td>
                                    <td>{service.unit}</td>
                                    <td style={{ width: '80px' }}>
                                        <button className="btn btn-info" onClick={() => handleViewService(service.id)}>Xem</button>
                                    </td>
                                    <td style={{ width: '80px' }}>
                                        {editIndex === index ? (
                                            <button className="btn btn-primary" onClick={() => saveEdit(service.id)}>Lưu</button>
                                        ) : (
                                            <button className="btn btn-warning" onClick={() => startEditing(index, service)}>Sửa</button>
                                        )}
                                    </td>
                                    <td style={{ width: '80px' }}>
                                        {editIndex === index ? (
                                            <button className="btn btn-secondary" onClick={cancelEditing}>Hủy</button>
                                        ) : (
                                            <button className="btn btn-danger" onClick={() => openDeleteModal(service.id)}>Xóa</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">Không có dịch vụ nào được tìm thấy.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>

                <div className="d-flex justify-content-center mb-4">
                    <button
                        className="btn btn-outline-success"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || totalPages === 0}
                    >
                        Trang trước
                    </button>
                    <span className="mx-3">Trang {currentPage + 1} / {totalPages}</span>
                    <button
                        className="btn btn-outline-success"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1 || totalPages === 0}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
            <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa dịch vụ này không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>Hủy</Button>
                    <Button variant="danger" onClick={confirmDeleteService}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default ServiceList;

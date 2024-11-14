import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { NavbarApp } from "../common/Navbar";
import Footer from "../common/Footer";
import { FaSearch } from 'react-icons/fa';
import { TbReload } from 'react-icons/tb';
import axios from 'axios';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [searchName, setSearchName] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    useEffect(() => {
        fetchServices(currentPage);
    }, [currentPage]);

    const fetchServices = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/services/list`, {
                params: { page, size: pageSize },
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            console.log("Dữ liệu dịch vụ:", response.data);
            setServices(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải danh sách dịch vụ:", error);
        }
    };

    const handleSearch = () => {
        fetchServices(0);
    };

    const handleReload = () => {
        setSearchName('');
        fetchServices(0);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleOpenModal = (service) => {
        setServiceToDelete(service);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleDeleteService = async () => {
        try {
            await axios.delete(`/api/services/delete/${serviceToDelete.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            setModalOpen(false);
            fetchServices(currentPage);
        } catch (error) {
            console.error("Lỗi khi xóa dịch vụ:", error);
        }
    };

    return (
        <>
            <NavbarApp />
            <div className="service-list container mt-5">
                <h2 className="text-center mb-5 bg-success text-white py-4">Danh sách dịch vụ</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button className="btn btn-success" onClick={handleReload}><TbReload /></button>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control mr-2"
                            placeholder="Tìm kiếm theo tên dịch vụ"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead className="table-success">
                        <tr className="text-center">
                            <th>STT</th>
                            <th>Tên Dịch Vụ</th>
                            <th>Giá</th>
                            <th>Đơn vị</th>
                            <th colSpan={2}>Hành Động</th>
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
                                    <td>
                                        <button className="btn btn-warning">Sửa</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleOpenModal(service)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">Không có dịch vụ nào</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>
                <div className="d-flex justify-content-center mb-4">
                    <button
                        className="btn btn-outline-success"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Trang trước
                    </button>
                    <span className="mx-3">Trang {currentPage + 1} / {totalPages}</span>
                    <button
                        className="btn btn-outline-success"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        Trang sau
                    </button>
                </div>

                {/* Modal xác nhận xóa */}
                <Modal show={isModalOpen} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xóa dịch vụ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Bạn có chắc chắn muốn xóa dịch vụ
                        <span className="text-danger"> {serviceToDelete?.name}</span>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>Hủy</Button>
                        <Button variant="danger" onClick={handleDeleteService}>Xóa</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default ServiceList;

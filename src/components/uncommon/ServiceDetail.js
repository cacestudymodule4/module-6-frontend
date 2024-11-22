import React, {useState, useEffect} from 'react';
import {Table, Modal, Button} from 'react-bootstrap';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

const ServiceDetail = () => {
    const {serviceId} = useParams();
    const [service, setService] = useState(null);
    const [grounds, setGrounds] = useState([]);
    const [groundToDelete, setGroundToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchServiceDetail();
    }, [serviceId]);

    const fetchServiceDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/services/detail/${serviceId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
            });
            setService(response.data.service);
            setGrounds(response.data.grounds);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết dịch vụ:", error);
        }
    };

    const openDeleteModal = (ground) => {
        setGroundToDelete(ground);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setGroundToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDeleteGround = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/services/delete/${serviceId}/grounds/${groundToDelete.groundId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
            });
            toast.success("Xóa mặt bằng thành công!");
            fetchServiceDetail();
        } catch (error) {
            console.error("Lỗi khi xóa mặt bằng:", error);
            toast.error("Không thể xóa mặt bằng. Vui lòng thử lại!");
        } finally {
            closeDeleteModal();
        }
    };

    return (
        <>
            <NavbarApp/>
            <div className="service-detail container mt-5">
                <h2 className="text-center mb-5 bg-success text-white py-4 rounded shadow">
                    Chi tiết Dịch vụ
                </h2>

                <div className="mb-5 px-4 rounded shadow-sm" style={{background: "#f8f9fa"}}>
                    <h3 className="text-success mb-4">Thông tin dịch vụ</h3>
                    {service ? (
                        <div className="row">
                            <div className="col-md-4">
                                <p className="fw-bold">Tên dịch vụ :</p>
                                <p>{service.name}</p>
                            </div>
                            <div className="col-md-4">
                                <p className="fw-bold">Giá :</p>
                                <p>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(service.price)}
                                </p>
                            </div>
                            <div className="col-md-4">
                                <p className="fw-bold">Đơn vị :</p>
                                <p>{service.unit}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted">Đang tải thông tin dịch vụ...</p>
                    )}
                </div>

                <h4 className="text-success mb-3">Danh sách mặt bằng sử dụng</h4>

                {grounds && grounds.length > 0 ? (
                    <div className="table-responsive mb-5">
                        <Table striped bordered hover>
                            <thead className="table-success">
                            <tr className="text-center">
                                <th>STT</th>
                                <th>Mã mặt bằng</th>
                                <th>Tiêu thụ</th>
                                <th>Ngày bắt đầu</th>
                                <th colSpan={2}>Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {grounds.map((ground, index) => (
                                <tr key={ground.id} className="text-center">
                                    <td>{index + 1}</td>
                                    <td>{ground.groundName}</td>
                                    <td>{ground.consumption}</td>
                                    <td>{new Date(ground.startDate).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() =>
                                                navigate(`/service/${serviceId}/grounds/${ground.groundId}/edit`)
                                            }
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger btn-sm"
                                                onClick={() => openDeleteModal(ground)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-muted">Không có mặt bằng nào liên kết với dịch vụ này.</p>
                )}

                <div className="d-flex justify-content-center gap-3 mt-4 mb-5">
                    <button
                        className="btn btn-outline-secondary btn-lg d-flex align-items-center"
                        onClick={() => navigate(`/service/list`)}
                    >
                        <i className="bi bi-arrow-left-circle me-2"></i>
                        Quay lại
                    </button>
                    <button
                        className="btn btn-outline-success btn-lg d-flex align-items-center"
                        onClick={() => navigate(`/service/${serviceId}/add-ground`)}
                    >
                        Thêm mới
                        <i className="bi bi-plus-circle"></i>
                    </button>
                </div>
            </div>

            <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa mặt bằng
                    <span className="text-danger fw-bold"> {groundToDelete?.groundName}</span> này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteGround}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer/>
        </>
    );

};

export default ServiceDetail;

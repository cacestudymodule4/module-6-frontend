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
            toast.error("Không thể tải thông tin dịch vụ.");
        }
    };

    const openDeleteModal = (groundId) => {
        setGroundToDelete(groundId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setGroundToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDeleteGround = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/services/delete/${serviceId}/grounds/${groundToDelete}`, {
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
                <h2 className="text-center mb-5 bg-success text-white py-4">Chi tiết Dịch vụ</h2>
                <div
                    style={{
                        backgroundColor: '#f8f9fa',
                        padding: '30px',
                        marginBottom: '30px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h4
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#28a745',
                            marginBottom: '20px',
                        }}
                    >
                        Thông tin dịch vụ
                    </h4>
                    {service ? (
                        <div style={{display: 'flex', justifyContent: 'space-between', gap: '20px'}}>
                            <div style={{flex: 1}}>
                                <p style={{margin: '5px 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'black'}}>
                                    Tên dịch vụ:
                                </p>
                                <p style={{margin: '5px 0', fontSize: '1.5rem', color: '#333'}}>{service.name}</p>
                            </div>
                            <div style={{flex: 1}}>
                                <p style={{
                                    margin: '5px 0',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'black'
                                }}>Giá:</p>
                                <p style={{margin: '5px 0', fontSize: '1.5rem', color: '#333'}}>{service.price}</p>
                            </div>
                            <div style={{flex: 1}}>
                                <p style={{margin: '5px 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'black'}}>Đơn
                                    vị:</p>
                                <p style={{margin: '5px 0', fontSize: '1.5rem', color: '#333'}}>{service.unit}</p>
                            </div>
                        </div>
                    ) : (
                        <p style={{fontSize: '1.5rem', color: '#666'}}>Đang tải thông tin dịch vụ...</p>
                    )}
                </div>
                <h4 className="text-success mb-3">Danh sách mặt bằng sử dụng</h4>
                {grounds && grounds.length > 0 ? (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="table-success">
                            <tr className="text-center">
                                <th>STT</th>
                                <th>Tên mặt bằng</th>
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
                                    <td style={{width: '50px'}}>
                                        <button className="btn btn-warning"
                                                onClick={() => navigate(`/service/${serviceId}/grounds/${ground.groundId}/edit`)}>Sửa
                                        </button>
                                    </td>
                                    <td style={{width: '50px'}}>
                                        <button className="btn btn-danger"
                                                onClick={() => openDeleteModal(ground.groundId)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <p>Không có mặt bằng nào liên kết với dịch vụ này.</p>
                )}
                <div className="d-flex justify-content-center mt-4" style={{marginBottom: "20px"}}>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate(`/service/${serviceId}/add-ground`)}
                    >
                        Thêm mới
                    </button>
                    <button className="btn btn-secondary" style={{marginLeft: "20px"}}
                            onClick={() => navigate(`/service/list`)}>Quay lại
                    </button>
                </div>
            </div>
            {/* Modal xác nhận xóa */}
            <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa mặt bằng <span
                    className="text-danger"> {groundToDelete?.groundName}</span>
                    này không?</Modal.Body>
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

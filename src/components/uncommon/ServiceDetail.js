import React, {useState, useEffect} from 'react';
import {Table} from 'react-bootstrap';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NavbarApp } from "../common/Navbar";
import Footer from "../common/Footer";

const ServiceDetail = () => {
    const {serviceId} = useParams();
    const [service, setService] = useState(null);
    const [grounds, setGrounds] = useState([]);
    const navigate = useNavigate();

    // Fetch service details and the associated grounds when the component mounts
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

    return (
        <>
            <NavbarApp />
            <div className="service-detail container mt-5">
                {/* Tiêu đề */}
                <h2 className="text-center mb-5 bg-success text-white py-4">Chi tiết Dịch vụ</h2>

                {/* Thông tin chi tiết dịch vụ */}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '5px 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>
                                    Tên dịch vụ:
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '1.5rem', color: '#333' }}>{service.name}</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '5px 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>Giá:</p>
                                <p style={{ margin: '5px 0', fontSize: '1.5rem', color: '#333' }}>{service.price}</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '5px 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>Đơn vị:</p>
                                <p style={{ margin: '5px 0', fontSize: '1.5rem', color: '#333' }}>{service.unit}</p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: '1.5rem', color: '#666' }}>Đang tải thông tin dịch vụ...</p>
                    )}
                </div>

                {/* Danh sách mặt bằng liên kết */}
                <h4 className="text-success mb-3">Danh sách mặt sử dụng</h4>
                {grounds && grounds.length > 0 ? (
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="table-success">
                            <tr className="text-center">
                                <th>STT</th>
                                <th>Tên mặt bằng</th>
                                <th>Tiêu thụ</th>
                                <th>Ngày bắt đầu</th>
                            </tr>
                            </thead>
                            <tbody>
                            {grounds.map((ground, index) => (
                                <tr key={ground.id} className="text-center">
                                    <td>{index + 1}</td>
                                    <td>{ground.groundName}</td>
                                    <td>{ground.consumption}</td>
                                    <td>{new Date(ground.startDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <p>Không có mặt bằng nào liên kết với dịch vụ này.</p>
                )}

                <div className="d-flex justify-content-center mt-4" style={{ marginBottom: "20px" }}>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceDetail;

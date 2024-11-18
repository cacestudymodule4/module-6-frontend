import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ServiceDetail = () => {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [grounds, setGrounds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchServiceDetail();
    }, []);

    const fetchServiceDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/services/detail/${serviceId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            setService(response.data.service);
            setGrounds(response.data.grounds);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết dịch vụ:", error);
            toast.error("Không thể tải thông tin dịch vụ");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Chi tiết Dịch vụ</h2>

            {service && (
                <div className="mb-5">
                    <h4>Thông tin dịch vụ:</h4>
                    <p><strong>Tên:</strong> {service.name}</p>
                    <p><strong>Giá:</strong> {service.price}</p>
                    <p><strong>Đơn vị:</strong> {service.unit}</p>
                </div>
            )}

            <h4>Danh sách mặt bằng liên kết:</h4>
            {grounds.length > 0 ? (
                <Table striped bordered hover>
                    <thead className="table-success">
                    <tr>
                        <th>STT</th>
                        <th>Tên mặt bằng</th>
                        <th>Diện tích</th>
                        <th>Giá</th>
                        <th>Loại</th>
                    </tr>
                    </thead>
                    <tbody>
                    {grounds.map((ground, index) => (
                        <tr key={ground.id}>
                            <td>{index + 1}</td>
                            <td>{ground.name}</td>
                            <td>{ground.area}</td>
                            <td>{ground.price}</td>
                            <td>{ground.groundCategory}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : (
                <p>Không có mặt bằng nào liên kết với dịch vụ này.</p>
            )}

            <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    );
};

export default ServiceDetail;

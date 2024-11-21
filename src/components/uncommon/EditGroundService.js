import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";

const EditGround = () => {
    const {serviceId, groundId} = useParams();
    const [service, setService] = useState(null);
    const [ground, setGround] = useState(null);
    const [consumption, setConsumption] = useState(0);
    const [startDate, setStartDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetails();
    }, [serviceId, groundId]);

    const fetchDetails = async () => {
        try {
            const serviceResponse = await axios.get(`http://localhost:8080/api/services/edit/${serviceId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("jwtToken")}`},
            });
            setService(serviceResponse.data);

            const groundServiceResponse = await axios.get(`http://localhost:8080/api/services/edit/${serviceId}/grounds/${groundId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("jwtToken")}`},
            });
            setConsumption(groundServiceResponse.data.consumption);
            setStartDate(groundServiceResponse.data.startDate);
        } catch (error) {
            console.error("Lỗi khi tải thông tin:", error);
            toast.error("Không thể tải thông tin.");
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:8080/api/services/${serviceId}/grounds/${groundId}`,
                null,
                {
                    params: {consumption, startDate},
                    headers: {Authorization: `Bearer ${localStorage.getItem("jwtToken")}`},
                }
            );
            toast.success("Cập nhật mặt bằng thành công!");
            navigate(`/service/${serviceId}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật mặt bằng:", error);
            toast.error("Không thể cập nhật mặt bằng.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Chỉnh sửa mặt bằng</h2>

            {/* Hiển thị thông tin dịch vụ */}
            {service && (
                <div className="mb-4">
                    <h4>Thông tin Dịch vụ</h4>
                    <p><strong>Tên dịch vụ:</strong> {service.name}</p>
                    <p><strong>Giá:</strong> {service.price}</p>
                    <p><strong>Đơn vị:</strong> {service.unit}</p>
                </div>
            )}

            {/* Hiển thị thông tin mặt bằng */}
            {ground && (
                <div className="mb-4">
                    <h4>Thông tin Mặt bằng</h4>
                    <p><strong>Tên mặt bằng:</strong> {ground.groundName}</p>
                </div>
            )}

            {/* Form chỉnh sửa */}
            <div className="form-group">
                <label>Tiêu thụ:</label>
                <input
                    type="number"
                    className="form-control"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Ngày bắt đầu:</label>
                <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <button className="btn btn-primary mt-3" onClick={handleUpdate}>
                Lưu
            </button>
            <button className="btn btn-secondary mt-3 ml-2" onClick={() => navigate(-1)}>
                Quay lại
            </button>
        </div>
    );
};

export default EditGround;

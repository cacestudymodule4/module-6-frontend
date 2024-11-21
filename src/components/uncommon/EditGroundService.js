import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

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
            const groundResponse = await axios.get(`http://localhost:8080/api/ground/find-gr/${groundId}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("jwtToken")}`},
            });
            setGround(groundResponse.data);
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
                `http://localhost:8080/api/services/update/${serviceId}/grounds/${groundId}`,
                null,
                {
                    params: {consumption, startDate},
                    headers: {Authorization: `Bearer ${localStorage.getItem("jwtToken")}`},
                }
            );
            toast.success("Cập nhật mặt bằng thành công!");
            navigate(`/service/detail/${serviceId}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật mặt bằng:", error);
            toast.error("Không thể cập nhật mặt bằng.");
        }
    };

    return (
        <>
            <NavbarApp />
            <div className="container mt-5">
                <h2 className="text-center bg-success text-white py-3 rounded">Chỉnh sửa mặt bằng</h2>

                {/* Hiển thị thông tin dịch vụ */}
                {service && (
                    <div className="card my-4">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Thông tin Dịch vụ</h4>
                        </div>
                        <div className="card-body">
                            <p><strong>Tên dịch vụ:</strong> {service.name}</p>
                            <p><strong>Giá:</strong> {service.price}</p>
                            <p><strong>Đơn vị:</strong> {service.unit}</p>
                        </div>
                    </div>
                )}

                {/* Hiển thị thông tin mặt bằng */}
                {ground && (
                    <div className="card my-4">
                        <div className="card-header bg-secondary text-white">
                            <h4 className="mb-0">Thông tin Mặt bằng</h4>
                        </div>
                        <div className="card-body">
                            <p><strong>Mã mặt bằng:</strong> {ground.groundCode}</p>
                        </div>
                    </div>
                )}

                {/* Form chỉnh sửa */}
                <form className="bg-light p-4 rounded shadow-sm">
                    <div className="row mb-3 align-items-center">
                        <label htmlFor="consumption" className="col-sm-3 col-form-label text-end">
                            Tiêu thụ:
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="number"
                                id="consumption"
                                className="form-control"
                                value={consumption}
                                onChange={(e) => setConsumption(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="startDate" className="col-sm-3 col-form-label text-end">
                            Ngày bắt đầu:
                        </label>
                        <div className="col-sm-9">
                            <input
                                type="date"
                                id="startDate"
                                className="form-control"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button
                            type="button"
                            className="btn btn-primary me-2"
                            onClick={handleUpdate}
                        >
                            Lưu
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditGround;

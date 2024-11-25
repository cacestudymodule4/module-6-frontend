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
            toast.success("Cập nhật dịch vụ thành công!");
            navigate(`/service/detail/${serviceId}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật mặt bằng:", error);
            toast.error("Không thể cập nhật mặt bằng.");
        }
    };

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5">

                <h2 className="text-center bg-success text-white py-3 rounded shadow">
                    Chỉnh sửa dịch vụ
                </h2>

                {service && (
                    <div className="card my-4 shadow">
                        <div className="card-header bg-secondary text-white">
                            <h4 className="mb-0">Thông tin Dịch vụ</h4>
                        </div>
                        <div className="card-body">
                            <p><strong>Tên dịch vụ:</strong> {service.name}</p>
                            <p><strong>Giá:</strong> {service.price}</p>
                            <p><strong>Đơn vị:</strong> {service.unit}</p>
                        </div>
                    </div>
                )}

                {ground && (
                    <div className="card my-4 shadow">
                        <div className="card-header bg-secondary text-white">
                            <h4 className="mb-0">Thông tin Mặt bằng</h4>
                        </div>
                        <div className="card-body">
                            <p><strong>Mã mặt bằng:</strong> {ground.groundCode}</p>
                        </div>
                    </div>
                )}

                <form className="bg-light p-4 rounded shadow-sm">
                    <div className="row mb-4">
                        <label htmlFor="consumption" className="col-sm-3 col-form-label">
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

                    <div className="row mb-4">
                        <label htmlFor="startDate" className="col-sm-3 col-form-label">
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

                    <div className="d-flex justify-content-center mt-4">
                        <button
                            type="button"
                            className="btn btn-outline-success btn-lg me-2 px-5"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left-circle me-2"></i> Quay lại
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-lg px-5"
                            onClick={handleUpdate}
                        >
                            Lưu <i className="bi bi-save"></i>
                        </button>
                    </div>
                </form>
            </div>
            <Footer/>
        </>
    );
};

export default EditGround;

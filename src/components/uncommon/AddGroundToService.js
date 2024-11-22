import React, {useEffect, useState} from 'react';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import axios from 'axios';
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";

const AddGroundToService = () => {
    const token = localStorage.getItem("jwtToken");
    const {serviceId} = useParams();
    const [grounds, setGrounds] = useState([]);
    const [selectedGroundId, setSelectedGroundId] = useState('');
    const [formData, setFormData] = useState({
        consumption: '',
        startDate: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate("login")
        const fetchGrounds = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/services/not-using-service/${serviceId}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                });
                setGrounds(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách mặt bằng:", error);
                toast.error("Không thể tải danh sách mặt bằng.");
            }
        };
        fetchGrounds();
    }, [serviceId]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/services/add-service-to-gr', null, {
                params: {
                    serviceId,
                    groundId: selectedGroundId,
                    consumption: formData.consumption,
                    startDate: formData.startDate
                },
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            toast.success("Thêm mặt bằng vào dịch vụ thành công");
            navigate(`/service/detail/${serviceId}`);
        } catch (error) {
            console.error("Lỗi khi thêm mặt bằng vào dịch vụ:", error);
            if (error.response) {
                toast.error(error.response.data);
            }
        }
    };

    return (
        <>
            <NavbarApp/>
            <div className="container my-5 rounded p-4" style={{maxWidth: '1000px'}}>
                <h2 className="text-center mb-5 bg-success text-white py-3 fs-3 rounded shadow">
                    Thêm mặt bằng vào dịch vụ
                </h2>
                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="row mb-4">

                        <div className="col-md-6">
                            <label htmlFor="groundId" className="form-label fs-5">Chọn Mặt Bằng</label>
                            <select
                                id="groundId"
                                className="form-select form-select-lg"
                                value={selectedGroundId}
                                onChange={(e) => setSelectedGroundId(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Chọn mặt bằng --</option>
                                {grounds.map((ground) => (
                                    <option key={ground.id} value={ground.id}>
                                        {ground.groundCode} (Diện tích: {ground.area}, Giá: {ground.price})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="consumption" className="form-label fs-5">Lượng tiêu thụ</label>
                            <input
                                type="number"
                                id="consumption"
                                name="consumption"
                                className="form-control form-control-lg"
                                value={formData.consumption}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="startDate" className="form-label fs-5">Ngày bắt đầu</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="form-control form-control-lg"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-3 mt-4 mb-5">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-lg d-flex align-items-center"
                                onClick={() => navigate(`/service/detail/${serviceId}`)}
                            >
                                <i className="bi bi-arrow-left-circle me-2"></i>
                                Quay lại
                            </button>
                        <button
                            type="submit"
                            className="btn btn-outline-success btn-lg">
                            Thêm Mới
                            <i className="bi bi-plus-circle"></i>
                        </button>
                    </div>
                </form>
            </div>
            <Footer/>
        </>
    );
};

export default AddGroundToService;

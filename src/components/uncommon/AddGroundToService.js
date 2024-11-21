import React, {useEffect, useState} from 'react';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import axios from 'axios';
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";

const AddGroundToService = () => {
    const {serviceId} = useParams();
    const [grounds, setGrounds] = useState([]);
    const [selectedGroundId, setSelectedGroundId] = useState('');
    const [formData, setFormData] = useState({
        consumption: '',
        startDate: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
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
            <div className="container mt-5">
                <h2 className="text-center mb-5 bg-success text-white py-4">Thêm mặt bằng vào dịch vụ</h2>
                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        {/* Chọn Mặt Bằng */}
                        <div className="col-md-6">
                            <label htmlFor="groundId" className="form-label">Chọn Mặt Bằng</label>
                            <select
                                id="groundId"
                                className="form-select"
                                value={selectedGroundId}
                                onChange={(e) => setSelectedGroundId(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Chọn mặt bằng --</option>
                                {grounds.map((ground) => (
                                    <option key={ground.id} value={ground.id}>
                                        {ground.name} (Diện tích: {ground.area}, Giá: {ground.price})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Consumption */}
                        <div className="col-md-3">
                            <label htmlFor="consumption" className="form-label">Lượng tiêu thụ</label>
                            <input
                                type="number"
                                id="consumption"
                                name="consumption"
                                className="form-control"
                                value={formData.consumption}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Start Date */}
                        <div className="col-md-3">
                            <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="form-control"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button type="submit" className="btn btn-success">Thêm Mới</button>
                            <button type="button" className="btn btn-secondary ms-3"
                                    onClick={() => navigate(`/service/detail/${serviceId}`)}>
                                Quay lại
                            </button>
                        </div>
                    </div>
                </form>
                <div className="mt-5"></div>
            </div>
            <Footer/>
        </>
    );
};

export default AddGroundToService;

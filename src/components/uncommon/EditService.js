import React, {useState, useEffect} from 'react';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";

const EditService = () => {
    const {serviceId} = useParams();
    const navigate = useNavigate();
    const [serviceData, setServiceData] = useState({name: '', price: '', unit: ''});

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/services/edit/${serviceId}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                });
                setServiceData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu dịch vụ:", error);
                toast.error("Không thể tải dữ liệu dịch vụ.");
                navigate('/service/list');
            }
        };

        fetchServiceData();
    }, [serviceId, navigate]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setServiceData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/services/update/${serviceId}`, serviceData, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
            });
            toast.success("Cập nhật thành công");
            navigate('/service/list');
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
            if (error.response) {
                toast.error(error.response.data);
            }
        }
    };

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5">
                <h2 className="text-center mb-5 bg-success text-white py-4">Chỉnh sửa dịch vụ</h2>
                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        {/* Tên Dịch Vụ */}
                        <div className="col-md-4">
                            <label htmlFor="name" className="form-label">Tên Dịch Vụ</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={serviceData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Giá */}
                        <div className="col-md-4">
                            <label htmlFor="price" className="form-label">Giá</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                className="form-control"
                                value={serviceData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Đơn vị */}
                        <div className="col-md-4">
                            <label htmlFor="unit" className="form-label">Đơn vị</label>
                            <input
                                type="text"
                                id="unit"
                                name="unit"
                                className="form-control"
                                value={serviceData.unit}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Nút Lưu */}
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button type="submit" className="btn btn-success">Cập nhật</button>
                            <button
                                type="button"
                                className="btn btn-secondary ms-3"
                                onClick={() => navigate('/service/list')}
                            >
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

export default EditService;

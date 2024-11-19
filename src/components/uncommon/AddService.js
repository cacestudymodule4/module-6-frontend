import React, {useState} from 'react';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import axios from 'axios';
import {toast} from "react-toastify";

const AddService = () => {
    const [serviceData, setServiceData] = useState({name: '', price: '', unit: ''});

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
            await axios.post('http://localhost:8080/api/services/add', serviceData, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
            });
            toast.success("Thêm mới dịch vụ thành công");
            setServiceData({name: '', price: '', unit: ''});
        } catch (error) {
            console.error("Lỗi khi thêm dịch vụ:", error);
            toast.error("Thêm mới dịch vụ thất bại");
        }
    };

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5">
                <h2 className="text-center mb-5 bg-success text-white py-4">Thêm mới dịch vụ</h2>
                <form className="form-group" onSubmit={handleSubmit}>
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <button type="submit" className="btn btn-success">Thêm Mới</button>
                </form>
            </div>
            <Footer/>
        </>
    );
};

export default AddService;

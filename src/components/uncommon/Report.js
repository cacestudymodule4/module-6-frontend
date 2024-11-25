import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import {toast} from "react-toastify";
import ChartComponent from "./ChartComponent";

const Chart8Component = () => {
    const [revenue, setRevenue] = useState();
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole');
    const navigate = useNavigate();
    const [reportRequest, setReportRequest] = useState({startDate: "", endDate: ""});
    const totalRevenue = () => {
        return Object.values(revenue).reduce((acc, cur) => acc + cur, 0);
    }
    useEffect(() => {
        if (!token) navigate("/login");
        if (role !== "ADMIN") {
            navigate("/home");
            toast.error("Bạn không có quyền thực hiên chức năng này")
        }
        const fetchData = async () => {
            try {
                const resp = await axios.post('http://localhost:8080/api/report', reportRequest, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                });
                const map = resp.data;
                setRevenue(map);
            } catch (error) {
                console.error('Thất bại khi lấy dữ liệu:', error);
            }
        };
        fetchData();
    }, [reportRequest]);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setReportRequest((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    return (
        <><NavbarApp></NavbarApp>
            <section className="py-3 py-md-5">
                <div className="container">
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-4">
                            <div className="form-group mb-3">
                                <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    value={reportRequest.startDate}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{padding: "10px", fontSize: "16px"}}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group mb-3">
                                <label htmlFor="endDate" className="form-label">Ngày kết thúc</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    id="endDate"
                                    value={reportRequest.endDate}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{padding: "10px", fontSize: "16px"}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-3">
                        {revenue && Object.keys(revenue).length > 0 ? (
                            <>
                                <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                                    <table className="table table-hover table-bordered border-success my-1"
                                           style={{fontSize: '1.05rem'}}>
                                        <thead className="table-success">
                                        <tr>
                                            <th>#</th>
                                            <th>Mặt bằng</th>
                                            <th>Doanh thu</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {Object.entries(revenue).map(([key, value], index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{key}</td>
                                                <td>{new Intl.NumberFormat('vi-VN', {
                                                    style: 'decimal',
                                                    currency: 'VND',
                                                }).format(value)} VND
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={2}><strong>Tổng doanh thu</strong></td>
                                            <td><strong>{new Intl.NumberFormat('vi-VN', {
                                                style: 'decimal',
                                                currency: 'VND',
                                            }).format(totalRevenue())} VND</strong></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <ChartComponent data={revenue}></ChartComponent>
                            </>
                        ) : (
                            <div className="col-12">
                                <p className="text-center">Không có dữ liệu để hiển thị.</p>
                            </div>
                        )}

                    </div>
                    <div className={"d-flex justify-content-center mt-4"}>
                        <Link className={"btn btn-secondary"} to="/home">
                            <i className="bi bi-arrow-left-circle me-2"></i>Quay lại</Link>
                    </div>
                </div>
            </section>
            <Footer></Footer>
        </>
    );
};
export default Chart8Component;

import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ApexCharts from 'apexcharts';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

const Chart8Component = () => {
    const [chart, setChart] = useState();
    const [revenue, setRevenue] = useState();
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const [reportRequest, setReportRequest] = useState({startDate: "", endDate: ""});
    const totalRevenue = () => {
        return Object.values(revenue).reduce((acc, cur) => acc + cur, 0);
    }
    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
        const fetchData = async () => {
            try {
                const resp = await axios.post('http://localhost:8080/api/report', reportRequest, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                });
                const map = resp.data;
                setRevenue(map);
                const chartOptions = {
                    series: [{
                        name: 'revenue',
                        data: Object.values(map)
                    }],
                    chart: {
                        type: 'bar',
                        height: 40 * Object.keys(map).length,
                        toolbar: {
                            show: true
                        }
                    },
                    xaxis: {
                        categories: Object.keys(map)
                    },
                    colors: ['#28a745'],
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false
                        }
                    }
                };

                if (chart) {
                    chart.destroy();
                }
                const newChart = new ApexCharts(document.querySelector("#bsb-chart-8"), chartOptions);
                newChart.render();
                setChart(newChart);
            } catch (error) {
                console.error('Thất bại khi lấy dữ liệu:', error);
            }
        };
        fetchData();
        return () => {
            if (chart) {
                chart.destroy();
            }
        };
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
                                {revenue ? (
                                    <>
                                        {Object.entries(revenue).map(([key, value], index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{key}</td>
                                                <td>{value} VND</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={2}><strong>Tổng doanh thu</strong></td>
                                            <td><strong>{totalRevenue()} VND</strong></td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan={3}>Đang tải...</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12 col-lg-9">
                            <div className="card widget-card border-light shadow-sm">
                                <div className="card-body p-4">
                                    <h5 className="card-title widget-card-title mb-2">Doanh Thu</h5>
                                    <div id="bsb-chart-8" className="mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"d-flex justify-content-center"}>
                        <Link className={"btn btn-dark btn-lg"} to="/home">Quay lại</Link>
                    </div>
                </div>
            </section>
            <Footer></Footer>
        </>
    );
};
export default Chart8Component;

import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ApexCharts from 'apexcharts';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

const Chart8Component = () => {
    const [chart, setChart] = useState();
    const [revenue, setRevenue] = useState();
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const totalRevenue = () => {
        return Object.values(revenue).reduce((acc, cur) => acc + cur, 0);
    }
    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
        const fetchData = async () => {
            try {
                const resp = await axios.get('http://localhost:8080/api/report', {
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
    }, []);
    return (
        <><NavbarApp></NavbarApp>
            <section className="py-3 py-md-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                            <table className="table table-striped my-1">
                                <thead>
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
                                            <td colSpan={2}>Tổng doanh thu</td>
                                            <td>{totalRevenue()} VND</td>
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
                </div>
            </section>
            <Footer></Footer>
        </>
    );
};

export default Chart8Component;

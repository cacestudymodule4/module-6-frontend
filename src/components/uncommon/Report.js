import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ApexCharts from 'apexcharts';
import axios from "axios";
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";

const Chart8Component = () => {
    const [chart, setChart] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const resp = await axios.get('http://localhost:8080/api/report');
                const chartOptions = {
                    series: [{
                        name: 'revenue',
                        data: [44, 55, 41, 67, 22, 43, 21, 49, 62, 25, 25, 100]
                    }],
                    chart: {
                        type: 'bar',
                        height: 350,
                        toolbar: {
                            show: true
                        }
                    },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
        <section className="py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Mặt bằng</th>
                                <th>Doanh thu</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>Nguyễn Văn A</td>
                                <td>123</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Trần Thị B</td>
                                <td>456</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Lê Văn C</td>
                                <td>789</td>
                            </tr>
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
    );
};

export default Chart8Component;

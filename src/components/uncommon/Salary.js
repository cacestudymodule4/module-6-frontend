import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/salary.css';
import axios from "axios";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";

const Salary = () => {
    const [salary, setSalary] = useState();
    const totalSalary = () => {
        return salary.reduce((acc, {salary}) => acc + salary, 0);
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get("http://localhost:8080/api/staff/list", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                })
                setSalary(resp.data);
            } catch (error) {
                console.log("Lỗi khi lấy dữ liệu: " + error);
            }
        }
        fetchData();
    }, [])
    return (
        <><NavbarApp></NavbarApp>
            <section className="py-3 py-md-5">
                <div className="container-salary">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="row gy-3 mb-3">
                                <div className="col-12 text-center">
                                    <h2 className="text-uppercase m-0 salary-header">Bảng Lương nhân viên</h2>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="table-responsive salary-table-responsive">
                                        <table className="table table-striped salary-table">
                                            <thead>
                                            <tr className="salary-tr">
                                                <th scope="col" className="text-uppercase salary-th">#</th>
                                                <th scope="col" className="text-uppercase salary-th">Họ và tên</th>
                                                <th scope="col" className="text-uppercase salary-th">Vị trí</th>
                                                <th scope="col" className="text-uppercase salary-th">Lương</th>
                                            </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                            {
                                                salary ? (<>{
                                                        salary.map((value, index) => (
                                                            <tr className="salary-tr" key={index}>
                                                                <td className="salary-td">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="salary-td">
                                                                    {value.name}
                                                                </td>
                                                                <td className="salary-td">
                                                                    Sell
                                                                </td>
                                                                <td className="text-end">{value.salary} VND</td>
                                                            </tr>))}
                                                        <tr>
                                                            <td colSpan={3}>Tổng</td>
                                                            <td>{totalSalary()} VND</td>
                                                        </tr>
                                                    </>
                                                ) : (<tr>
                                                    <td colSpan={4}>Đang tải...</td>
                                                </tr>)
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer></Footer>
        </>
    )
}
export default Salary;
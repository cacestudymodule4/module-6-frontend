import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/salary.css';
import axios from "axios";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import * as XLSX from 'xlsx';

const totalSalary = (data) => {
    return data.reduce((sum, {salary}) => sum + salary, 0);
}
const handleExportToExcel = async (filename) => {
    try {
        const resp = await axios.get("http://localhost:8080/api/salary-csv", {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
        });
        const data = resp.data;
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, filename + '.xlsx');
    } catch (error) {
        toast.error(error.response.data);
    }
}
export const formatDate = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('vi-VN').replace(/\//g, '-');
    const formattedTime = now.toLocaleTimeString('vi-VN').replace(/[:]/g, '-');
    return formattedDate + "_" + formattedTime;
}
const Salary = () => {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem("userRole");
    const navigate = useNavigate();
    const [salary, setSalary] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState("id");
    const [sortDir, setSortDir] = useState("asc");
    const [q, setQ] = useState("");
    const [size, setSize] = useState(5);
    const [total, setTotal] = useState(null);
    const sum = async () => {
        try {
            const resp = await axios.get("http://localhost:8080/api/salary", {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                params: {
                    sort: sort,
                    sortDir: sortDir,
                    page: 0,
                    q: q,
                    size: 999
                }
            });
            setTotal(totalSalary(resp.data.content));
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu: " + error);
        }
    }
    useEffect(() => {
        if (!token) navigate("/login");
        if (role !== "ADMIN") {
            navigate("/home");
            toast.error("Bạn không có quyền thực hiện hành động này");
        }
        const fetchData = async () => {
            try {
                const resp = await axios.get("http://localhost:8080/api/salary", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                    params: {
                        sort: sort,
                        sortDir: sortDir,
                        page: page - 1,
                        q: q,
                        size: size
                    }
                });
                setSalary(resp.data.content);
                setTotalPages(resp.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu: " + error);
            }
        };
        if (!total) sum();
        fetchData();
    }, [page, sort, sortDir, q, size, total]);
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    }
    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    }
    const handleSort = (column) => {
        if (sort === column) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSort(column);
            setSortDir("asc");
        }
    }
    const handleSearch = (event) => {
        setQ(event.target.value);
        setPage(1);
    }
    const handleShowAll = (size) => {
        setPage(1);
        setSize(size);
    }
    return (
        <><NavbarApp/>
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
                                    <div className="d-flex mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tìm kiếm theo tên, vị trí, số điện thoại..."
                                            value={q}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <div className="table-responsive salary-table-responsive">
                                        <table className="table table-hover table-bordered border-success salary-table"
                                               style={{fontSize: '1.05rem'}}>
                                            <thead className="table-success">
                                            <tr className="salary-tr">
                                                <th scope="col" className="text-uppercase salary-th"
                                                    onClick={() => handleSort("id")} style={{cursor: 'pointer'}}>#
                                                </th>
                                                <th scope="col" className="text-uppercase salary-th"
                                                    onClick={() => handleSort("name")} style={{cursor: 'pointer'}}>Họ và
                                                    tên
                                                </th>
                                                <th scope="col" className="text-uppercase salary-th"
                                                    onClick={() => handleSort("position")}
                                                    style={{cursor: 'pointer'}}>Ví trí
                                                </th>
                                                <th scope="col" className="text-uppercase salary-th"
                                                    onClick={() => handleSort("salary")}
                                                    style={{cursor: 'pointer'}}>Lương
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                            {salary.length > 0 ? (
                                                <>
                                                    {salary.map((value, index) => (
                                                        <tr className="salary-tr" key={index}>
                                                            <td className="salary-td">{index + 1 + (page - 1) * 5}</td>
                                                            <td className="salary-td">{value.name}</td>
                                                            <td className="salary-td">{value.position}</td>
                                                            <td className="text-end">{new Intl.NumberFormat('vi-VN', {
                                                                style: 'decimal',
                                                                currency: 'VND',
                                                            }).format(value.salary)} VND</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan={3} className="text-center">Tổng</td>
                                                        <td className="text-center">{new Intl.NumberFormat('vi-VN', {
                                                            style: 'decimal',
                                                            currency: 'VND',
                                                        }).format(total)} VND</td>
                                                    </tr>
                                                </>
                                            ) : (
                                                <tr>
                                                    <td colSpan={4}>Đang tải...</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div
                                        className={"col-12 d-flex justify-content-center justify-content-lg-end align-items-end text-success"}>
                                        {size === 999 ?
                                            <p onClick={() => handleShowAll(5)} style={{cursor: 'pointer'}}>
                                                Thu lại
                                            </p>
                                            :
                                            <p onClick={() => handleShowAll(999)} style={{cursor: 'pointer'}}>
                                                Xem tất cả
                                            </p>}
                                    </div>
                                    <div className="d-flex justify-content-between"
                                         style={{marginBottom: "20px"}}>
                                        <button className="btn btn-outline-success"
                                                onClick={() => handlePreviousPage()}
                                                disabled={page === 1}>Trang trước
                                        </button>
                                        <span
                                            className={"d-flex justify-content-end align-items-end"}>Trang {page} / {totalPages}</span>
                                        <button className="btn btn-outline-success"
                                                onClick={() => handleNextPage()}
                                                disabled={page === totalPages}>Trang sau
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-center justify-content-lg-end mb-3">
                                        <button className="btn btn-success" onClick={() =>
                                            handleExportToExcel(`salary_report_` + formatDate())
                                        }>
                                            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                                            Tải xuống Excel
                                        </button>
                                    </div>
                                    <div className="justify-content-center align-items-center mt-3">
                                        <div className="d-flex justify-content-center">
                                            <Link className="btn btn-secondary" to="/home">
                                                <i className="bi bi-arrow-left-circle me-2"></i>Quay lại</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    );
}
export default Salary;

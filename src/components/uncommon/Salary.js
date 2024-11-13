import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/salary.css';
import axios from "axios";
import Footer from "../common/Footer";
import {NavbarApp} from "../common/Navbar";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward, faFastBackward, faFastForward, faForward} from "@fortawesome/free-solid-svg-icons";

const exportToCSV = async (filename) => {
    const resp = await axios.get("http://localhost:8080/api/salary-csv", {
        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
    });
    const data = resp.data;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
    data.forEach(row => {
        const values = headers.map(header => `"${row[header]}"`);
        csvRows.push(values.join(',') + " VND");
    });
    const totalSalary = data.reduce((sum, {salary}) => sum + salary, 0);
    csvRows.push(`Tổng,,"${totalSalary} VND"`);
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
const Salary = () => {
    const [salary, setSalary] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState("id");
    const [sortDir, setSortDir] = useState("asc");
    const [q, setQ] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get("http://localhost:8080/api/salary", {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                    params: {
                        sort: sort,
                        sortDir: sortDir,
                        page: page - 1,
                        q: q
                    }
                });
                setSalary(resp.data.content);
                setTotalPages(resp.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu: " + error);
            }
        };
        fetchData();
    }, [page, sort, sortDir, q]);
    const formatDate = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('vi-VN').replace(/\//g, '-');
        const formattedTime = now.toLocaleTimeString('vi-VN').replace(/[:]/g, '-');
        return formattedDate + "_" + formattedTime;
    }
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
                                            placeholder="Tìm kiếm theo tên hoặc email"
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
                                                    onClick={() => handleSort("id")}>#
                                                </th>
                                                <th scope="col" className="text-uppercase salary-th"
                                                    onClick={() => handleSort("name")}>Họ và tên
                                                </th>
                                                <th scope="col" className="text-uppercase salary-th"
                                                    onClick={() => handleSort("position")}>Ví trí
                                                </th>
                                                <th scope="col" className="text-uppercase salary-th"
                                                    onClick={() => handleSort("salary")}>Lương
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                            {salary.length > 0 ? (
                                                <>
                                                    {salary.map((value, index) => (
                                                        <tr className="salary-tr" key={index}>
                                                            <td className="salary-td">{index + 1 + (page - 1)}</td>
                                                            <td className="salary-td">{value.name}</td>
                                                            <td className="salary-td">{value.position}</td>
                                                            <td className="text-end">{value.salary} VND</td>
                                                        </tr>
                                                    ))}
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
                                        className="row pagination-controls d-flex mt-3 justify-content-between align-items-center">
                                        <div className="col-3"></div>
                                        <div className="col-6 d-flex justify-content-center mb-3">
                                            <button
                                                className="btn bg-body-secondary"
                                                onClick={() => setPage(1)}
                                                disabled={page === 1}
                                            ><FontAwesomeIcon icon={faFastBackward}/>
                                            </button>
                                            <button
                                                className="btn bg-body-secondary"
                                                onClick={handlePreviousPage}
                                                disabled={page === 1}
                                            ><FontAwesomeIcon icon={faBackward}/>
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => {
                                                const pageNum = i + 1;
                                                if (
                                                    pageNum >= page - 2 &&
                                                    pageNum <= page + 2 &&
                                                    pageNum > 0 &&
                                                    pageNum <= totalPages
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setPage(pageNum)}
                                                            className={`btn ${
                                                                page === pageNum ? 'bg-danger-subtle' : 'bg-body-secondary'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })}
                                            <button
                                                className="btn bg-body-secondary"
                                                onClick={handleNextPage}
                                                disabled={page === totalPages}
                                            ><FontAwesomeIcon icon={faForward}/>
                                            </button>
                                            <button
                                                className="btn bg-body-secondary"
                                                onClick={() => setPage(totalPages)}
                                                disabled={page === totalPages}
                                            ><FontAwesomeIcon icon={faFastForward}/>
                                            </button>
                                        </div>
                                        <div className="col-3 d-flex justify-content-end mb-3">
                                            <button className="btn btn-success btn-lg" onClick={() =>
                                                exportToCSV(`salary_report_` + formatDate())
                                            }>
                                                Download CSV
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center align-items-center mt-3">
                                        <div className="d-flex justify-content-center">
                                            <Link className="btn btn-dark btn-lg" to="/home">Quay lại</Link>
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

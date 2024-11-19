import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaRedo, FaSearch, FaFilter} from 'react-icons/fa';  // Import icon từ react-icons
import {Table, Modal, Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {toast} from "react-toastify";
import {Formik, Field, Form as FormikForm} from "formik";
import '../../assets/css/Contract.css';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import moment from "moment/moment";
import Pagination from "react-bootstrap/Pagination";

function RoomFacilities() {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredContract, setFilteredContract] = useState([]);
    const [searchParams, setSearchParams] = useState({});
    const formikRef = useRef(null);
    const token = localStorage.getItem('jwtToken');
    useEffect(() => {
        if (!token) navigate("/login")

        async function getContract() {
            try {
                const response = await axios.get("http://localhost:8080/api/a/list", {
                    params: {
                        page: currentPage - 1,
                        size: pageSize,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}` // Thêm Authorization nếu cần
                    }
                });
                setRoomFacilities(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log(response.data.content);
            } catch (err) {
                console.error("Error:", err.response || err.message);
            }
        }

        getContract();
    }, [shouldRefresh, pageSize]);

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{color: "white", height: "70px"}}>
                    Danh sách hợp đồng</h2>
                {roomFacilities.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                    <>
                        <Table striped bordered hover>
                            <thead className={"custom-table text-white text-center"}>
                            <tr>
                                <th>STT</th>
                                <th>Loại thiết bị </th>
                                <th>Tên thiết bị</th>
                                <th>Số lượng</th>
                                <th>Số lượng hỏng</th>
                                <th>Ghi chú</th>
                                <th>Mã mặt bằng</th>
                                <th colSpan="3" className="text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roomFacilities.map((facilities, index) => (
                                <tr key={facilities.id}>
                                    <td className="text-center">{index+1}</td>
                                    <td className="text-center">{facilities.facilitiesType.name}</td>
                                    <td className="text-center">{facilities.name}</td>
                                    <td className="text-center">{facilities.quantity}</td>
                                    <td className="text-center">{facilities.damaged}</td>
                                    <td className="text-center">{facilities.description}</td>
                                    <td className="text-center">{facilities.ground.id}</td>
                                    <td className="text-center">
                                        <Button variant="info" type="button"
                                                onClick={() => navigate(`/contract/detail/${facilities.id}`)}
                                        >
                                            Chi tiết
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="warning" type="submit"
                                                onClick={() => navigate(`/contract/edit/${facilities.id}`)}
                                        >
                                            Sửa
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="danger" type="submit"
                                        >
                                            Xoá
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>

                    </>}
            </div>
            <Footer/>
        </> );
}
export default RoomFacilities;


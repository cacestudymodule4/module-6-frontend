import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaRedo, FaSearch} from 'react-icons/fa';  // Import icon từ react-icons
import {Table, Modal, Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {toast} from "react-toastify";
import {Formik, Field, Form as FormikForm} from "formik";
import '../../assets/css/Contract.css';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import Pagination from "react-bootstrap/Pagination";

function RoomFacilities() {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [facilitiesToDelete, setFacilitiesToDelete] = useState(null);
    const [facilitiesType, setFacilitiesType] = useState(null);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({});
    const formikRef = useRef(null);
    const token = localStorage.getItem('jwtToken');
    useEffect(() => {
        if (!token) navigate("/login")

        async function getFacilities() {
            try {
                const response = await axios.get("http://localhost:8080/api/facilities/list", {
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
            } catch (err) {
                console.error("Error:", err.response || err.message);
            }
        }

        async function facilitiesType() {
            try {
                const response = await axios.get("http://localhost:8080/api/facilities-type/list", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });
                setFacilitiesType(response.data);

            } catch (err) {
                console.error(err);
            }
        };
        facilitiesType()
        getFacilities();
    }, [shouldRefresh, pageSize]);
    const handleDeleteClick = (facilities) => {
        setFacilitiesToDelete(facilities);
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = async () => {
        setShowDeleteModal(false)
        try {
            await axios.delete(`http://localhost:8080/api/facilities/delete/${facilitiesToDelete.id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            toast.success('xoá thành công.');
            setShouldRefresh(prev => !prev)
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearch = async (value) => {
        try {
            setCurrentPage(1);
            const data = {
                facilitiesType: value?.facilitiesType,
                facilitiesName: value?.facilitiesName,
                ground: value?.ground,
            };

            const response = await axios.get("http://localhost:8080/api/facilities/search", {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                params: data,
            });
            setRoomFacilities(response.data.content);
            setTotalPages(response.data.totalPages);
            setSearchParams(data);
        } catch (err) {
            console.log(err);
        }
    };
    const handleReload = () => {
        setShouldRefresh(prev => !prev)
        setCurrentPage(1);
        setSearchParams({});
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    }
    const handlePageChange = async (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            try {
                const params = Object.keys(searchParams).length > 0
                    ? {...searchParams, page: page - 1}
                    : {page: page - 1, size: pageSize};

                const res = await axios.get(
                    Object.keys(searchParams).length > 0
                        ? `http://localhost:8080/api/facilities/search`
                        : `http://localhost:8080/api/facilities/list`,
                    {
                        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                        params,
                    }
                );
                setRoomFacilities(res.data.content);
            } catch (error) {
                console.log(error)
            }
        }
    };
    return (
        <>
            <NavbarApp/>
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{color: "white", height: "70px"}}>
                    Danh sách trang thiết bị</h2>
                <Formik
                    innerRef={formikRef}
                    initialValues={{
                        facilitiesType: "",
                        facilitiesName: "",
                        ground: "",
                    }}
                    onSubmit={(value) => handleSearch(value)}
                >
                    {() => (
                        <FormikForm className="mb-3 custom-search ">
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Field as="select" name="facilitiesType"
                                       className="custom-date-input custom-select "
                                >
                                    <option value=""
                                            selected={true}> Chọn loại thiết bị
                                    </option>
                                    {facilitiesType?.map((type) => (
                                        <option key={type.id} value={type.name} className={"text-center"}>
                                            {type.name}
                                        </option>
                                    ))}

                                </Field>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Tìm theo tên thiết bị"
                                    className="custom-date-input"
                                    name="facilitiesName"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Tìm theo mã mặt bằng"
                                    className="custom-date-input"
                                    name="ground"
                                />
                            </Form.Group>
                            <Button variant="secondary" type="submit" style={{marginTop: "-15px", marginRight: "20%"}}
                                    className={"search-contract-btn"}>
                                <FaSearch></FaSearch>
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
                <Button variant={"success"} className={"mb-2"}
                        onClick={() => navigate('/facilities/add')}>Thêm mới</Button>
                <Button variant="secondary" style={{borderRadius: "50%"}} className={"mb-2 ms-2 "}
                        onClick={handleReload}>
                    <FaRedo/>
                </Button>
                {roomFacilities.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                    <>
                        <Table striped bordered hover>
                            <thead className={"custom-table text-white text-center"}>
                            <tr>
                                <th>STT</th>
                                <th style={{width: "10%"}}>Loại thiết bị</th>
                                <th style={{width: "15%"}}>Tên thiết bị</th>
                                <th style={{width: "10%"}}>Số lượng</th>
                                <th style={{width: "12%"}}>Số lượng hỏng</th>
                                <th style={{width: "15%"}}>Ghi chú</th>
                                <th style={{width: "12%"}}>Mã mặt bằng</th>
                                <th colSpan="3" className="text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roomFacilities.map((facilities, index) => (
                                <tr key={facilities.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">{facilities.facilitiesType.name}</td>
                                    <td className="text-center">{facilities.name}</td>
                                    <td className="text-center">{facilities.quantity}</td>
                                    <td className="text-center">{facilities.damaged}</td>
                                    <td className="text-center">{facilities.description}</td>
                                    <td className="text-center">{facilities.ground.id}</td>
                                    <td className="text-center">
                                        <Button variant="warning" type="submit"
                                                onClick={() => navigate(`/facilities/edit/${facilities.id}`)}
                                        >
                                            Sửa
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="danger" type="submit"
                                                onClick={() => handleDeleteClick(facilities)}>
                                            Xoá
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center">
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                                {[...Array(totalPages).keys()].map((pageNumber) => (
                                    <Pagination.Item
                                        key={pageNumber + 1}
                                        active={pageNumber + 1 === currentPage}
                                        onClick={() => handlePageChange(pageNumber + 1)}
                                    >
                                        {pageNumber + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    </>}
            </div>
            <Modal show={showDeleteModal}>
                <Modal.Header closeButton onClick={() => setShowDeleteModal(false)}>
                    <Modal.Title>Xác Nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Xác nhận xóa: <span
                    className={"text-danger"}>"{facilitiesToDelete?.name}"</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Xóa
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer/>
        </>);
}

export default RoomFacilities;


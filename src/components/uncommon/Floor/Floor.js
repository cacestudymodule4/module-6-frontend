import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRedo, FaSearch } from 'react-icons/fa';  // Import icon từ react-icons
import { Table, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { Formik, Field, Form } from "formik";
import { NavbarApp } from "../../common/Navbar";
import Footer from "../../common/Footer";
import Pagination from 'react-bootstrap/Pagination';

export const Floor = () => {
    const navigate = useNavigate();
    const [floors, setFloor] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentFloor, setCurrentFloor] = useState({});
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const formikRef = useRef(null);

    const initialValues = {
        name: '',
        area: '',
        typeOfFloor: ''
    };

    useEffect(() => {
        async function getFloors() {
            try {
                const response = await axios.get("http://localhost:8080/api/floor/list"
                    , {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    });
                setFloor(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.log(err);
            }
        }

        getFloors();
    }, [shouldRefresh]);

    const handleReload = () => {
        setShouldRefresh(prev => !prev);
        setCurrentPage(1);
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    }

    const handleSearch = async (values) => {
        try {
            const data = {
                name: values?.name,
                area: values?.area,
                typeOfFloor: values?.typeOfFloor
            }
            const res = await axios.get(`http://localhost:8080/api/floor/search`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                params: data
            });
            setFloor(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.log(err);
        }
    }

    const handleShowModalDelete = (floor) => {
        setCurrentFloor(floor);
        setShowDeleteModal(true);
    }

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/floor/delete/${currentFloor.id}`
                , {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                });
            toast.success("Xoá thành công");
            handleReload();
            setShowDeleteModal(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = async (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            try {
                const res = await axios.get(`http://localhost:8080/api/floor/list?page=${page - 1}`
                    , {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    });
                setFloor(res.data.content);
            } catch (error) {
                toast.error("Có gì đó sai sai!")
            }
        }
    };

    return (
        <>
            <NavbarApp />
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center" style={{ color: "white", height: "70px" }}>
                    Danh sách tầng</h2>
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    onSubmit={(value) => handleSearch(value)}
                >
                    <Form className="mb-3 custom-search">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Tìm theo tên tầng</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập tên tầng"
                                name="name"
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="area" className="form-label">Tìm kiếm theo diện tích</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập diện tích"
                                name="area"
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="typeOfFloor" className="form-label">Tìm kiếm theo loại tầng</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập loại tầng"
                                name="typeOfFloor"
                                className="form-control"
                            />
                        </div>
                        <Button variant="secondary" type="submit" className="mt-3">
                            <FaSearch></FaSearch>
                        </Button>
                    </Form>
                </Formik>
                <Button variant={"success"} className={"mb-2"} onClick={() => navigate('/floor/add')}>Thêm mới</Button>
                <Button variant="secondary" className={"mb-2 ms-2 "} onClick={handleReload}>
                    <FaRedo />
                </Button>
                {floors.length === 0
                    ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>)
                    :
                    <>
                        <Table striped bordered hover>
                            <thead className={"custom-table text-white text-center"}>
                                <tr>
                                    <th>Mã tầng lầu</th>
                                    <th>Tên tầng</th>
                                    <th>Diện tích</th>
                                    <th>Sức chứa</th>
                                    <th>Loại tầng</th>
                                    <th colSpan="3" className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {floors.map((floor, index) => (
                                    <tr key={floor.id} className="text-center">
                                        <td>{floor.floorCode}</td>
                                        <td>{floor.name}</td>
                                        <td>{floor.area}m<sup>2</sup></td>
                                        <td>{floor.capacity}</td>
                                        <td>{floor.typeOfFloor}</td>
                                        <td className="text-center">
                                            <Button variant="warning" type="submit"
                                                onClick={() => navigate(`/floor/edit/${floor.id}`, { state: { floor } })}
                                            >
                                                Sửa
                                            </Button>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="danger" type="submit" onClick={() => handleShowModalDelete(floor)}>
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

                    </>
                }

                <Modal show={showDeleteModal} centered onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác Nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc chắn muốn xóa tầng có mã số: "{currentFloor.floorCode}" không?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Xóa
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >

            <Footer />
        </>
    );
}

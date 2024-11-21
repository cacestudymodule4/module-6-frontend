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

export const Ground = () => {
    const navigate = useNavigate();
    const [grounds, setGrounds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentGround, setCurrentGround] = useState({});
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [searchParams, setSearchParams] = useState({});

    const formikRef = useRef(null);

    const initialValues = {
        groundCode: '',
        area: '',
        price: ''
    };

    useEffect(() => {
        async function getGrounds() {
            try {
                const response = await axios.get("http://localhost:8080/api/ground/get-all"
                    , {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    });
                setGrounds(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.log(err);
            }
        }

        getGrounds();
    }, [shouldRefresh]);

    const handleReload = () => {
        setShouldRefresh(prev => !prev);
        setCurrentPage(1);
        setSearchParams({});
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    }

    const handleSearch = async (values) => {
        setCurrentPage(1);
        try {
            const data = {
                groundCode: values?.groundCode,
                area: values?.area,
                price: values?.price
            }
            const res = await axios.get(`http://localhost:8080/api/ground/search`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                params: data
            });
            setGrounds(res.data.content);
            setTotalPages(res.data.totalPages);
            setSearchParams(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleShowModalDelete = (ground) => {
        setCurrentGround(ground);
        setShowDeleteModal(true);
    }

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/ground/delete/${currentGround.id}`
                , {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                });

            toast.success("Xoá thành công");
            handleReload();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error(error.response.data || "Có lỗi, vui lòng kiểm tra lại!");
        }
    }

    const handlePageChange = async (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            try {
                let res;
                if (Object.keys(searchParams).length > 0) {
                    res = await axios.get(`http://localhost:8080/api/ground/get-all`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                        },
                        params: {
                            ...searchParams,
                            page: page - 1
                        }
                    });
                } else {
                    res = await axios.get(`http://localhost:8080/api/ground/get-all?page=${page - 1}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    });
                }
                setGrounds(res.data.content);
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
                    Danh sách mặt bằng</h2>
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    onSubmit={(value) => handleSearch(value)}
                >
                    <Form className="mb-3 custom-search">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Tìm theo mã mặt bằng</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập mã mặt bằng"
                                name="groundCode"
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
                            <label htmlFor="typeOfFloor" className="form-label">Tìm kiếm theo giá tiền</label>
                            <Field
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập giá tiền"
                                name="price"
                                className="form-control"
                            />
                        </div>
                        <Button variant="secondary" type="submit" className="mt-3">
                            <FaSearch></FaSearch>
                        </Button>
                    </Form>
                </Formik>
                <Button variant={"success"} className={"mb-2"} onClick={() => navigate('/ground/add')}>Thêm mới</Button>
                <Button variant="secondary" className={"mb-2 ms-2 "} onClick={handleReload}>
                    <FaRedo />
                </Button>
                {grounds.length === 0
                    ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>)
                    :
                    <>
                        <Table striped bordered hover>
                            <thead className={"custom-table text-white text-center"}>
                                <tr>
                                    <th>Mã mặt bằng</th>
                                    <th>Loại mặt bằng</th>
                                    <th>Diện tích</th>
                                    <th>Trạng thái</th>
                                    <th>Giá tiền</th>
                                    <th colSpan="3" className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grounds.map((ground, index) => (
                                    <tr key={ground.id} className="text-center">
                                        <td>{ground.groundCode}</td>
                                        <td>{ground.groundCategory}</td>
                                        <td>{ground.area}m<sup>2</sup></td>
                                        <td>{ground.status ? "Đã thuê" : "Chưa thuê"}</td>
                                        <td>{ground.price}</td>
                                        <td className="text-center">
                                            <Button variant="warning" type="submit"
                                                onClick={() => navigate(`/ground/edit/${ground.id}`, { state: { ground } })}
                                            >
                                                Sửa
                                            </Button>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="danger" type="submit" onClick={() => handleShowModalDelete(ground)}>
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
                    <Modal.Body>Bạn có chắc chắn muốn xóa mặt bằng có mã số: "{currentGround.groundCode}" không?</Modal.Body>
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

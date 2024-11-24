import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRedo, FaSearch } from 'react-icons/fa';
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
    const [searchParams, setSearchParams] = useState({});
    const [floorCategories, setFloorCategories] = useState([]);

    const formikRef = useRef(null);

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

        const getFloorCategories = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/floor-category/list`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    }
                );
                setFloorCategories(res.data);

            } catch (error) {
                console.log(error);

            }
        }

        getFloors();
        getFloorCategories();
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
                name: values?.name,
                areaFrom: values?.areaFrom,
                areaTo: values?.areaTo,
                floorCategoryId: values?.floorCategoryId
            }
            const res = await axios.get(`http://localhost:8080/api/floor/search`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                params: data
            });
            setFloor(res.data.content);
            setTotalPages(res.data.totalPages);
            setSearchParams(data);
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
            toast.error(error.response.data);
        }
    }

    const handlePageChange = async (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            try {
                let res;
                if (Object.keys(searchParams).length > 0) {
                    res = await axios.get(`http://localhost:8080/api/floor/search`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                        },
                        params: {
                            ...searchParams,
                            page: page - 1
                        }
                    });
                } else {
                    res = await axios.get(`http://localhost:8080/api/floor/list?page=${page - 1}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                    });
                }
                setFloor(res.data.content);
            } catch (error) {
                toast.error("Có gì đó sai sai!")
            }
        }
    };

    const initialValues = {
        name: '',
        areaFrom: '',
        areaTo: '',
        floorCategoryId: floorCategories[0]?.id || ''
    };

    return (
        <>
            <NavbarApp />
            <div className="my-5 rounded mx-auto p-4" style={{ minHeight: '45vh' }}>
                <h3 className="text-center mb-5 bg-success rounded text-white py-3" style={{ fontSize: '2.25rem' }}>
                    Danh sách tầng</h3>
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    enableReinitialize
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
                            <label htmlFor="area" className="form-label">Tìm kiếm theo diện tích trong khoảng</label>
                            <div className="d-flex">
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Từ"
                                    name="areaFrom"
                                    className="form-control"
                                />
                                <span className="mt-2 ms-3 me-3">-</span>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Đến"
                                    name="areaTo"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="floorId" className="form-label" style={{ fontSize: '1.2rem' }}>Chọn loại tầng:</label>
                            <Field
                                as="select"
                                id="floorCategoryId"
                                name="floorCategoryId"
                                className="form-select form-control">
                                {floorCategories.map(element => (
                                    <option key={element.id} value={element.id}>
                                        {element.name}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <Button variant="secondary" type="submit" className="mt-3">
                            <FaSearch></FaSearch>
                        </Button>
                    </Form>
                </Formik>
                <Button variant="success" className="mb-4"
                    style={{ fontSize: '1.1rem', padding: '0.75rem 2rem', marginTop: '1rem', marginRight: '10px' }}
                    onClick={() => navigate('/floor/add')}>
                    <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i>Thêm mới</Button>

                <Button variant="secondary" className="mb-4"
                    style={{ fontSize: '1.1rem', padding: '0.75rem 2rem', marginTop: '1rem' }} onClick={handleReload}>
                    <FaRedo />
                </Button>
                {floors.length === 0
                    ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>)
                    :
                    <>
                        <Table striped bordered hover>
                            <thead className={"custom-table text-white text-center table-success"}>
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
                                        <td>{floor.capacity} người</td>
                                        <td>{floor.floorCategory.name}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="warning"
                                                type="button"
                                                onClick={() => navigate(`/floor/edit/${floor.id}`, { state: { floor } })}
                                            >
                                                <i className="bi bi-pencil me-2"></i>Sửa
                                            </Button>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="danger"
                                                type="button"
                                                onClick={() => handleShowModalDelete(floor)}
                                            >
                                                <i className="bi bi-trash me-2"></i>Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-center ">
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
                    <Modal.Body>Bạn có chắc chắn muốn xóa tầng có mã số: <span
                        className="text-danger"> "{currentFloor.floorCode}" </span> không?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Xóa
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <Footer />
        </>
    );
}

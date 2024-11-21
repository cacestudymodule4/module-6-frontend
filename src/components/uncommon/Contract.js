import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaRedo, FaSearch, FaFilter} from 'react-icons/fa';
import {Table, Modal, Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {toast} from "react-toastify";
import {Formik, Field, Form as FormikForm} from "formik";
import '../../assets/css/Contract.css';
import {NavbarApp} from "../common/Navbar";
import Footer from "../common/Footer";
import moment from "moment/moment";
import Pagination from "react-bootstrap/Pagination";

function Contract() {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);
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
                const response = await axios.get("http://localhost:8080/api/contract/list-page", {
                    params: {
                        page: currentPage - 1,
                        size: pageSize,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}` // Thêm Authorization nếu cần
                    }
                });
                setFilteredContract(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.log(err);
            }
        }

        getContract();
    }, [shouldRefresh, pageSize, currentPage, token, navigate]);

    const handleReload = () => {
        setShouldRefresh(prev => !prev)
        setCurrentPage(1);
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    }
    const handleSearch = async (value) => {
        try {
            setCurrentPage(1);
            const data = {
                taxCode: value?.taxCode,
                nameCustomer: value?.nameCustomer,
                startDateStr: value?.startDate,
                endDateStr: value?.endDate,
            };

            const response = await axios.get("http://localhost:8080/api/contract/search", {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                params: data,
            });
            setFilteredContract(response.data.content);
            setTotalPages(response.data.totalPages);
            setSearchParams(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageChange = async (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            try {
                const params = Object.keys(searchParams).length > 0
                    ? {...searchParams, page: page - 1}
                    : {page: page - 1, size: pageSize};

                const res = await axios.get(
                    Object.keys(searchParams).length > 0
                        ? `http://localhost:8080/api/contract/search`
                        : `http://localhost:8080/api/contract/list-page`,
                    {
                        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                        params,
                    }
                );
                setFilteredContract(res.data.content);
            } catch (error) {
                toast.error("Có gì đó sai sai!");
            }
        }
    };

    const handleAddContract = () => {
        navigate('/contract/add')
    }
    const isContractActive = (dayend, dayStart) => {
        const currentDate = new Date();
        const contractEndDate = new Date(dayend);
        const contractStartDate = new Date(dayStart);
        if (contractStartDate > currentDate) {
            return "Chưa có hiệu lực"
        }
        if (contractEndDate < currentDate) {
            return "Hết hiệu lực"
        }
        if (contractStartDate < currentDate) {
            return "Có hiệu lực"
        }
    };
    const handleDeleteClick = (contract) => {
        setContractToDelete(contract);
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        try {
            await axios.delete(`http://localhost:8080/api/contract/delete/${contractToDelete.id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            toast.success('xoá thành công.');
            // setShouldRefresh(prev => !prev)
            handleReload()
        } catch (error) {
            console.log(error);
        }
    }
    const handleFilter = async (value) => {
        setCurrentPage(1);
        try {
            const data = {
                selectedFilter: value.selectedFilter,
            }
            const resp = await axios.get(`http://localhost:8080/api/contract/filter`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                    params: data
                },
            )
            if (resp.status === 200) {
                setFilteredContract(resp.data.content);
                setTotalPages(resp.data.totalPages);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <NavbarApp/>
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{color: "white", height: "70px"}}>
                    Danh sách hợp đồng</h2>
                <Formik
                    innerRef={formikRef}
                    initialValues={{
                        taxCode: "",
                        nameCustomer: "",
                        startDate: "",
                        endDate: "",
                    }}
                    onSubmit={(value) => handleSearch(value)}
                >
                    {() => (
                        <FormikForm className="mb-3 custom-search ">
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Label className="small-label">Tìm theo tên khách hàng</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Nhập tên khách hàng"
                                    name="nameCustomer"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Label className="small-label">Tìm kiếm theo mã hợp đồng</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Nhập mã hợp đồng"
                                    name="taxCode"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Label className="small-label">Tìm kiếm theo ngày bắt đầu</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="date"
                                    className="custom-date-input"
                                    name="startDate"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Label className="small-label">Tìm kiếm theo ngày kết thúc</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="date"
                                    className="custom-date-input"
                                    placeholder="Tìm kiếm theo ngày kết thúc"
                                    name="endDate"
                                />
                            </Form.Group>
                            <Button variant="secondary" type="submit" className={"search-contract-btn"}>
                                <FaSearch></FaSearch>
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
                <Formik
                    initialValues={{
                        selectedFilter: "",
                    }}
                    innerRef={formikRef}
                    onSubmit={handleFilter}>
                    {() => (
                        <FormikForm className="mb-3">
                            <Form.Group className="mb-3">
                                <Field as="select" name="selectedFilter" style={{borderRadius: "5px"}}
                                       className="custom-date-input "

                                >
                                    <option value=""
                                            selected={true}> Chọn tình trạng hợp đồng
                                    </option>
                                    <option value="Có hiệu lực">Có hiệu lực
                                    </option>
                                    <option value="Hết hiệu lực">Hết hiệu lực
                                    </option>
                                    <option value="Chưa có hiệu lực">Chưa có hiệu lực
                                    </option>

                                </Field>
                                <Button variant="secondary" style={{height: "42px", borderRadius: "50%"}}
                                        className={"ms-2"} type="submit">
                                    <FaFilter/> </Button>
                            </Form.Group>
                        </FormikForm>
                    )}
                </Formik>
                <Button variant={"success"} className={"mb-2"} onClick={handleAddContract}>Thêm mới</Button>
                <Button variant="secondary" style={{borderRadius: "50%"}} className={"mb-2 ms-2 "}
                        onClick={handleReload}>
                    <FaRedo/>
                </Button>
                {filteredContract.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                    <>
                        <Table striped bordered hover>
                            <thead className={"custom-table text-white text-center"}>
                            <tr>
                                <th>Mã hợp đồng</th>
                                <th>Tên khách hàng</th>
                                <th>Mã mặt bằng</th>
                                <th>Trạng thái hợp đồng</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th colSpan="3" className="text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredContract.map((contract, index) => (
                                <tr key={contract.id}>
                                    <td className="text-center">{contract.code}</td>
                                    <td className="text-center">{contract.customer.name}</td>
                                    <td className="text-center">{contract.ground.groundCode}</td>
                                    <td className="text-center">
                                        {isContractActive(contract.endDate, contract.startDate)}
                                    </td>
                                    <td className="text-center">{moment(contract.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                                    <td className="text-center">{moment(contract.endDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                                    <td className="text-center">
                                        <Button variant="info" type="button"
                                                onClick={() => navigate(`/contract/detail/${contract.id}`)}
                                        >
                                            Chi tiết
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="warning" type="submit"
                                                onClick={() => navigate(`/contract/edit/${contract.id}`)}
                                        >
                                            Sửa
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="danger" type="submit"
                                                onClick={() => handleDeleteClick(contract)}>
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
                <Modal show={showDeleteModal}>
                    <Modal.Header closeButton onClick={() => setShowDeleteModal(false)}>
                        <Modal.Title>Xác Nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Xác nhận xóa hợp đồng mã số: <span
                        className={"text-danger"}>"{contractToDelete?.code}"</span>
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
            </div>
            <Footer/>
        </>
    )
        ;
}

export default Contract;

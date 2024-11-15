import React, {useState, useEffect} from "react";
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

function Contract() {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [pageSize] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    useEffect(() => {
        async function getContract() {
            try {
                const response = await axios.get("http://localhost:8080/api/contract/list-1"
                    , {
                        params: {
                            page: page - 1,
                            size: pageSize,
                        },
                        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                    });
                setFilteredCustomers(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        getContract();
    }, [shouldRefresh, page]);
    const handleReload = () => {
        setShouldRefresh(prev => !prev)
    }
    const handleSearch = async (value, page = 1) => {
        try {
            const data = {
                taxCode: `%${value.taxCode}%`,
                nameCustomer: `%${value.nameCustomer}%`,
                startDateStr: value.startDate,
                endDateStr: value.endDate,
                page: page - 1,
                size: pageSize,
            }
            console.log(page)
            console.log(pageSize)
            const response = await axios.get(`http://localhost:8080/api/contract/search`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                    params: data
                },
            )
            console.log(response.data)
            setFilteredCustomers(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(page);

        } catch
            (err) {
            console.log(err);
        }
    }
    const handleAddContract = () => {
        navigate('/contract/add')
    }
    const isContractActive = (dayend) => {
        const currentDate = new Date();
        const contractEndDate = new Date(dayend);
        return contractEndDate > currentDate;
    };
    const handleDeleteClick = (contract) => {
        setContractToDelete(contract);
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = async () => {
        setShowDeleteModal(false)
        try {
            await axios.delete(`http://localhost:8080/api/contract/delete/${contractToDelete.id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            toast.success('xoá thành công.');
            setShouldRefresh(prev => !prev)
        } catch (error) {
            console.log(error);
        }
    }
    const handleFilter = async (value) => {
        try {
            const data = {
                selectedFilter: value.selectedFilter,
                page: page - 1,
                size: pageSize,
            }
            const resp = await axios.get(`http://localhost:8080/api/contract/filter`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                    params: data
                },
            )
            if (resp.status === 200) {
                setFilteredCustomers(resp.data.content);
            }
        } catch (err) {
            console.log(err)
        }
    }
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    return (
        <>
            <NavbarApp/>
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-5 bg-success align-content-center"
                    style={{color: "white", height: "70px"}}>
                    Danh sách hợp đồng</h2>
                <Formik
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
                                    <option value="Chưa có hệu lực">Chưa có hiệu lực
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
                {filteredCustomers.length === 0 ? (<h1 className={"text-center mt-5"}>Danh sách trống </h1>) :
                    <>
                        <Table striped bordered hover>
                            <thead className={"custom-table text-white text-center"}>
                            <tr>
                                <th>Mã hợp đồng</th>
                                <th>Tên khách hàng</th>
                                <th>Tên mặt bằng</th>
                                <th>Trạng thái hợp đồng</th>
                                <th>Ngày băt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th colSpan="3" className="text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCustomers.map((contract, index) => (
                                <tr key={contract.id}>
                                    <td className="text-center">{contract.code}</td>
                                    <td className="text-center">{contract.customer.name}</td>
                                    <td className="text-center">{contract.ground.name}</td>
                                    <td className="text-center">
                                        {isContractActive(contract.endDate) ? "Có hiệu lực" : "Hết hiệu lực"}
                                    </td>
                                    <td className="text-center">{moment(contract.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                                    <td className="text-center">{moment(contract.endDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                                    <td className="text-center">
                                        <Button variant="info" type="submit"
                                                onClick={() => navigate(`/contract/detail/${contract.id}`, {state: {contract}})}
                                        >
                                            Chi tiết
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="warning" type="submit"
                                                onClick={() => navigate(`/contract/edit`, {state: {contract}})}
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
                        <div className="d-flex justify-content-center align-items-center"
                             style={{marginBottom: "20px"}}>
                            <button className="btn btn-outline-success" onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}>Trang trước
                            </button>
                            <span style={{marginRight: "20px", marginLeft: "20px"}}>Trang {page} / {totalPages}</span>
                            <button className="btn btn-outline-success" onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}>Trang sau
                            </button>
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

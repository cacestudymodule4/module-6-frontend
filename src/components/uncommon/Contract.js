import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaRedo, FaSearch} from 'react-icons/fa';  // Import icon từ react-icons
import {Table, Modal, Button, Form, Navbar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {toast} from "react-toastify";
import {Formik, Field, Form as FormikForm, ErrorMessage} from "formik";
import '../../assets/css/Contract.module.css';

function Contract() {
    const navigate = useNavigate();
    const [listContract, setListContract] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [contract, setContract] = useState([]);
    useEffect(() => {
        async function getContract() {
            try {
                const response = await axios.get("http://localhost:8080/api/contract/list"
                    , {
                        headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
                    });
                setListContract(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        getContract();
    }, [shouldRefresh]);
    const handleReload = () => {
        setShouldRefresh(prev => !prev)
    }
    const handleSearch = async (value) => {
        try {
            const data = {
                taxCode: `%${value.taxCode}%`,
                nameCustomer: `%${value.nameCustomer}%`,
                startDateStr: value.startDate,
                endDateStr: value.endDate
            }
            const res = await axios.get(`http://localhost:8080/api/contract/search`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                    params: data
                },
            )
            if (res.status === 200) {
                setListContract(res.data);
            }
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
    return (
        <>
            <div className="container mt-5">
                <h2 className="text-center mb-5" style={{color: "#6d757d"}}>Danh sách hợp đồng</h2>
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
                        <FormikForm className="mb-3 custom-search">
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
                                <Form.Label className="small-label">Tìm kiếm theo mã số thuế</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Nhập mã mặt bằng"
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
                                    placeholder="Tìm kiếm theo ngày kết thúc"
                                    name="endDate"
                                />
                            </Form.Group>
                            <Button variant="secondary" type="submit" className={"search"}>
                                <FaSearch></FaSearch>
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
                <Button variant={"success"} className={"mb-2"} onClick={handleAddContract}>Thêm mới</Button>
                <Button variant="secondary" className={"mb-2 ms-2"} onClick={handleReload}>
                    <FaRedo/>
                </Button>
                <Table striped bordered hover>
                    <thead className={"custom-table text-white text-center"}>
                    <tr>
                        <th>ID</th>
                        <th>Tên khách hàng</th>
                        <th>Tên mặt bằng</th>
                        <th>Đang thuê</th>
                        <th colSpan="3" className="text-center">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listContract.map((contract, index) => (
                        <tr key={contract.id}>
                            <td className="text-center">CT{contract.id}</td>
                            <td className="text-center">{contract.customer.name}</td>
                            <td className="text-center">{contract.ground.name}</td>
                            <td className="text-center">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={isContractActive(contract.endDate)}
                                    readOnly
                                />
                            </td>
                            <td className="text-center">
                                <Button variant="info" type="submit"
                                        onClick={() => navigate(`/contract/detail/${contract.id}`, {state: {contract}})}
                                >
                                    Chi tiết
                                </Button>
                            </td>
                            <td className="text-center">
                                <Button variant="warning" type="submit">
                                    Sửa
                                </Button>
                            </td>
                            <td className="text-center">
                                <Button variant="danger" type="submit" onClick={() => handleDeleteClick(contract)}>
                                    Xoá
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Modal show={showDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác Nhận</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc chắn muốn xóa hợp đồng mã số: "CT{contractToDelete?.id}"
                        không?</Modal.Body>
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
        </>
    );
}

export default Contract;

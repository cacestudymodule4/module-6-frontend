import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {FaRedo, FaSearch} from 'react-icons/fa';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import {useNavigate} from 'react-router-dom';
import {Button, Form, Modal} from 'react-bootstrap';
import {Form as FormikForm, Formik, Field} from 'formik';
import {NavbarApp} from '../common/Navbar';
import Footer from '../common/Footer';

function Staff() {
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const [filteredStaffList, setFilteredStaffList] = useState([]);
    const [staffDelete, setStaffDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 4;
    const userRole = localStorage.getItem("userRole");

    const fetchStaffList = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/staff/list?page=${currentPage}&size=${pageSize}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            console.log(response)
            const activeStaff = response.data.content.filter(staff => !staff.disabled);
            setFilteredStaffList(activeStaff);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách nhân viên");
        }
    };

    useEffect(() => {
        if (!token) navigate('/login');
        fetchStaffList();
    }, [currentPage]);

    const handleOpenModal = (staff) => {
        setStaffDelete(staff);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setStaffDelete(null);
    };

    const handleDisableStaff = async () => {
        if (!staffDelete || !staffDelete.id) {
            toast.error("Chọn nhân viên hợp lệ để xóa");
            return;
        }
        try {
            await axios.put(`http://localhost:8080/api/staff/disable/${staffDelete.id}`, {}, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
            });
            toast.success("Nhân viên đã được xóa thành công!");
            handleCloseModal();
            fetchStaffList();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa nhân viên");
        }
    };

    const handleAddStaff = () => {
        navigate('/staff/add');
    };

    const handleSearch = async (values) => {
        const data = {
            codeStaff: `%${values.codeStaff}%`,
            name: `%${values.name}%`,
            position: `%${values.position}%`,
            page: currentPage,
            size: pageSize,
        };
        try {
            const response = await axios.get('http://localhost:8080/api/staff/search', {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}, params: data
            });
            if (response.status === 200) {
                setFilteredStaffList(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tìm kiếm nhân viên");
        }
    };

    const handleEditStaff = (id) => {
        navigate(`/staff/edit/${id}`);
        setCurrentPage(0);
        fetchStaffList();
    };

    const handlePageChange = (newPage) => {

        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            handleSearch({
                codeStaff: "", name: "", position: "",
            });
        }
    };

    const formatCurrency = (value) => {
        return value ? new Intl.NumberFormat('vi-VN').format(value) : '0';
    };

    function handleReload() {
        fetchStaffList();
        toast.info("Đang tải lại danh sách nhân viên...");
    }

    return (<>
            <NavbarApp/>
            <div className="container-fluid my-5 rounded mx-auto p-4" style={{minHeight: '45vh'}}>
                <h3 className="text-center text-white py-3 bg-success rounded mb-5" style={{fontSize: '2.25rem'}}>
                    Danh sách nhân viên văn phòng
                </h3>

                <Formik
                    initialValues={{
                        codeStaff: "", name: "", position: "",
                    }}
                    onSubmit={(values) => handleSearch(values)}
                >
                    {() => (<FormikForm className="mb-3 custom-search">
                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Label className="small-label">Tìm kiếm theo mã nhân viên</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Nhập mã nhân viên"
                                    name="codeStaff"
                                    style={{marginBottom: '0.5rem'}}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Label className="small-label">Tìm kiếm theo tên nhân viên</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Nhập tên nhân viên"
                                    name="name"
                                    style={{marginBottom: '0.5rem'}}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formSearch">
                                <Form.Label className="small-label">Tìm kiếm theo bộ phận</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    placeholder="Nhập bộ phận"
                                    name="position"
                                    style={{marginBottom: '0.5rem'}}
                                />
                            </Form.Group>

                            <Button variant="secondary" type="submit" className="search" style={{borderRadius: '50%'}}>
                                <FaSearch/>
                            </Button>
                        </FormikForm>)}
                </Formik>

                {userRole === "ADMIN" && (
                    <div className="d-flex align-items-center mb-4" style={{gap: '1rem', marginTop: '1rem'}}>
                        <Button
                            variant="success"
                            onClick={handleAddStaff}
                            style={{fontSize: '1.1rem', padding: '0.75rem 2rem'}}
                        >
                            <i className="bi bi-plus-circle" style={{marginRight: '8px'}}></i> Thêm mới nhân viên
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleReload}
                            style={{fontSize: '1.1rem', padding: '0.75rem 2rem'}}
                        >
                            <FaRedo/>
                        </Button>
                    </div>)}

                <div className="table-responsive">
                    <table className="table table-hover table-bordered border-success" style={{fontSize: '1.05rem'}}>
                        <thead className="table-success">
                        <tr>
                            <th className="text-center">STT</th>
                            <th className="text-center">Mã nhân viên</th>
                            <th className="text-center">Họ tên</th>
                            <th className="text-center">Ngày sinh</th>
                            <th className="text-center">Giới tính</th>
                            <th className="text-center">Địa chỉ</th>
                            <th className="text-center">Điện thoại</th>
                            {userRole !== "ADMIN" ? "" : <th className="text-center">CCCD/CMDN</th>}
                            <th className="text-center">Email</th>
                            {userRole !== "ADMIN" ? "" : <th className="text-center">Lương</th>}
                            <th className="text-center">Ngày làm việc</th>
                            <th className="text-center">Bộ phận</th>
                            {userRole !== "ADMIN" ? "" : <th className="text-center">Hành động</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredStaffList.map((staff, index) => (<tr key={staff.id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{staff?.codeStaff || "Chưa có"}</td>
                                <td className="text-center">{staff?.name || "Chưa có"}</td>
                                <td className="text-center">{staff.birthday ? moment(staff.birthday, 'YYYY-MM-DD').format('DD-MM-YYYY') : "Chưa có"}</td>
                                <td className="text-center">{staff.gender ? 'Nam' : 'Nữ'}</td>
                                <td className="text-center">{staff?.address || "Chưa có"}</td>
                                <td className="text-center">{staff?.phone || "Chưa có"}</td>
                                {userRole !== "ADMIN" ? "" :
                                    <td className="text-center">{staff?.identification || "Chưa có"}</td>}
                                <td className="text-center">{staff?.email || "Chưa có"}</td>
                                {userRole !== "ADMIN" ? "" :
                                    <td className="text-center">{staff?.salary ? formatCurrency(staff.salary) : "Chưa có"}</td>}
                                <td className="text-center">{staff?.startDate ? moment(staff.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "Chưa có"}</td>
                                <td className="text-center">{staff?.position?.name || "Chưa có"}</td>
                                {userRole !== "ADMIN" ? "" : (<td className="text-center">
                                        <button
                                            onClick={() => handleEditStaff(staff.id)}
                                            className="btn btn-warning"
                                            style={{marginRight: '0.5rem'}}
                                        >
                                            <i className="bi bi-pencil me-2"></i> Sửa
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(staff)}
                                            className="btn btn-danger"
                                        >
                                            <i className="bi bi-trash me-2"></i> Xóa
                                        </button>
                                    </td>)}
                            </tr>))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <Button
                        variant="secondary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Trước
                    </Button>
                    <span className="mx-3">{currentPage + 1}/{totalPages}</span>
                    <Button
                        variant="secondary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        Sau
                    </Button>
                </div>

            </div>

            <Modal show={isModalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa nhân viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {staffDelete ? (
                        <p>Bạn có chắc chắn muốn xóa nhân viên <span style={{color: "red"}}>{staffDelete.name}</span> không?</p>
                    ) : (
                        <p>Không có nhân viên nào được chọn.</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
                    <Button variant="danger" onClick={handleDisableStaff}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            <Footer/>
        </>);
}

export default Staff;

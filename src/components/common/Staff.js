import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {FaSearch} from 'react-icons/fa';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import {useNavigate} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";
import {NavbarApp} from "./Navbar";
import Footer from "./Footer";

function Staff() {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [filteredStaffList, setFilteredStaffList] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [staffDelete, setStaffDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/staff/list', {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
        })
            .then(response => {
                setStaffList(response.data);
                setFilteredStaffList(response.data);
            })
            .catch(error => toast.error("Lỗi khi tải danh sách nhân viên"));
    }, []);

    const handleOpenModal = (customer) => {
        setStaffDelete(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setStaffDelete(null);
    };

    const handleDeleteStaff = async () => {
        if (!staffDelete || !staffDelete.id) {
            toast.error("Chọn nhân viên hợp lệ để xóa");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/staff/delete/${staffDelete.id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setStaffList(staffList.filter(emp => emp.id !== staffDelete.id));
            handleCloseModal();
            toast.success("Nhân viên đã được xóa thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa nhân viên");
        }
    };

    const handleAddStaff = () => {
        navigate('/staff/list/add');
    };

    const handleSearch = async () => {
        if (!searchName.trim()) {
            toast.error("Vui lòng nhập tên nhân viên để tìm kiếm");
            return;
        }

        try {
            const response = await axios.get('http://localhost:8080/api/staff/search', {
                params: {keyword: searchName},
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setFilteredStaffList(response.data);
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm nhân viên");
        }
    };

    return (
        <>
            <NavbarApp></NavbarApp>
            <div className="container mt-5 rounded col-lg-10 mx-auto">
                <h3 className="text-center text-white py-3 bg-success rounded" style={{fontSize: '1.75rem'}}>
                    Danh sách nhân viên văn phòng
                </h3>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex" style={{gap: '1rem'}}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên nhân viên..."
                            className="form-control border-success"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            style={{fontSize: '1.1rem', padding: '0.75rem'}}
                        />
                        <button className="btn btn-success d-flex align-items-center justify-content-center"
                                onClick={handleSearch}
                                style={{fontSize: '1.1rem', padding: '0.75rem 1.25rem'}}>
                            <FaSearch/>
                        </button>
                    </div>

                    <Button variant="success" onClick={handleAddStaff}
                            style={{fontSize: '1.1rem', padding: '0.75rem 1.5rem'}}>
                        Thêm mới nhân viên
                    </Button>
                </div>

                <table className="table table-hover table-bordered border-success" style={{fontSize: '1.05rem'}}>
                    <thead className="table-success">
                    <tr>
                        <th>Mã nhân viên</th>
                        <th>Họ tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Địa chỉ</th>
                        <th>Điện thoại</th>
                        <th>Email</th>
                        <th>Lương</th>
                        <th>Ngày làm việc</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStaffList.map(staff => (
                        <tr key={staff.id}>
                            <td>{staff.id}</td>
                            <td>{staff.name}</td>
                            <td>{moment(staff.birthDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                            <td>{staff.gender ? 'Nam' : 'Nữ'}</td>
                            <td>{staff.address}</td>
                            <td>{staff.phone}</td>
                            <td>{staff.email}</td>
                            <td>{staff.salary}</td>
                            <td>{moment(staff.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                            <td>
                                <button className="btn btn-info btn-sm me-2" style={{fontSize: '0.9rem'}}>Xem</button>
                                <button className="btn btn-warning btn-sm me-2" style={{fontSize: '0.9rem'}}>Cập nhật
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleOpenModal(staff)}
                                        style={{fontSize: '0.9rem'}}>Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <ToastContainer position="top-right" autoClose={5000}/>

                <Modal show={isModalOpen} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{fontSize: '1.1rem'}}>Bạn có chắc chắn muốn xóa nhân viên {staffDelete?.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleDeleteStaff} style={{fontSize: '1rem'}}>Xóa</Button>
                        <Button variant="secondary" onClick={handleCloseModal} style={{fontSize: '1rem'}}>Hủy</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Footer></Footer>
        </>
    );
}

export default Staff;

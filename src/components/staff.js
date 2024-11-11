import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {FaSearch} from 'react-icons/fa';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [filteredStaffList, setFilteredStaffList] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [updatedEmployee, setUpdatedEmployee] = useState({
        name: '',
        gender: true,
        address: '',
        phone: '',
        email: '',
        salary: '',
        startDate: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/staff', {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
        })
            .then(response => {
                setStaffList(response.data);
                setFilteredStaffList(response.data);
            })
            .catch(error => toast.error("Lỗi khi tải danh sách nhân viên"));
    }, [staffList]);

    const deleteEmployee = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/staff/delete/${id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setStaffList(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
            toast.success("Nhân viên đã được xóa thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa nhân viên");
            console.error("Error deleting employee:", error);
        }
    };

    const handleSearch = () => {
        const filteredList = staffList.filter(staff =>
            staff.name.toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredStaffList(filteredList);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUpdatedEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdate = () => {
        if (!updatedEmployee.name || !updatedEmployee.email) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        axios.put(`http://localhost:8080/api/staff/update/${updatedEmployee.id}`, updatedEmployee, {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
        })
            .then(response => {
                toast.success("Cập nhật thành công!");
                setStaffList(prevStaffList => prevStaffList.map(staff =>
                    staff.id === response.data.id ? response.data : staff
                ));
                setSelectedEmployee(null);
                setSearchName('');
            })
            .catch(error => {
                toast.error("Lỗi khi cập nhật thông tin nhân viên");
            });
    };

    const handleEditClick = (staff) => {
        setSelectedEmployee(staff);
        setUpdatedEmployee({
            id: staff.id,
            name: staff.name,
            gender: staff.gender,
            address: staff.address,
            phone: staff.phone,
            email: staff.email,
            salary: staff.salary,
            startDate: staff.startDate
        });
    };

    return (
        <div className="container mt-5 p-5 rounded shadow bg-light">
            <h3 className="text-center text-white py-3 bg-success rounded">Danh sách nhân viên văn phòng</h3>

            <div className="d-flex mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên nhân viên..."
                    className="form-control me-3 border-success"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <button className="btn btn-success px-4" onClick={handleSearch}>
                    <FaSearch/>
                </button>
            </div>

            {selectedEmployee && (
                <div className="modal fade show" id="updateModal" style={{display: 'block'}} aria-hidden="true"
                     tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cập nhật thông tin nhân viên</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                        onClick={() => setSelectedEmployee(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Họ tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={updatedEmployee.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label">Giới tính</label>
                                    <select
                                        className="form-select"
                                        id="gender"
                                        name="gender"
                                        value={updatedEmployee.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value={true}>Nam</option>
                                        <option value={false}>Nữ</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={updatedEmployee.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={updatedEmployee.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={updatedEmployee.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="salary" className="form-label">Lương</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="salary"
                                        name="salary"
                                        value={updatedEmployee.salary}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="startDate"
                                        name="startDate"
                                        value={updatedEmployee.startDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                        onClick={() => setSelectedEmployee(null)}>Đóng
                                </button>
                                <button type="button" className="btn btn-success" onClick={handleUpdate}>Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <table className="table table-hover table-bordered border-success">
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
                        <td>{staff.birthDate}</td>
                        <td>{staff.gender ? 'Nam' : 'Nữ'}</td>
                        <td>{staff.address}</td>
                        <td>{staff.phone}</td>
                        <td>{staff.email}</td>
                        <td>{staff.salary}</td>
                        <td>{staff.startDate}</td>
                        <td>
                            <button className="btn btn-info btn-sm me-1">Xem</button>
                            <button className="btn btn-warning btn-sm me-1" onClick={() => handleEditClick(staff)}>Cập
                                nhật
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(staff.id)}>Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ToastContainer position="top-right" autoClose={5000}/>
        </div>
    );
}

export default Staff;

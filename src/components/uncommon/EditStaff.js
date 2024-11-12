import React, {useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";

function EditStaff() {

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [updatedEmployee, setUpdatedEmployee] = useState({
        name: '',
        gender: true,
        address: '',
        phone: '',
        email: '',
        salary: '',
        startDate: ''
    });

    const handleEdit = () => {
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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUpdatedEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        selectedEmployee && (
            <div className="modal fade show" id="updateModal" style={{display: 'block'}} aria-hidden="true"
                 tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Cập nhật thông tin nhân viên</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"
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
            </div>)
    )
}

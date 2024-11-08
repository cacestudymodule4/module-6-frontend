import React, {useEffect, useState} from 'react';
import moment from 'moment';
import axios from 'axios';

function Staff() {

    const [searchName, setSearchName] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [staffList, setStaffList] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:8080/api/staff`, {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
            .then(response => {
                setStaffList(response.data);
            })
            .catch(error => {
                console.error("Có lỗi xảy ra khi tải danh sách nhân viên", error)
            })
    }, []);

    const deleteEmployee = async (id) => {
        console.log(localStorage.getItem('jwtToken'));
        await axios.delete(`http://localhost:8080/api/staff/delete/${id}`, {headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}}
        )
            .then(() => {
                setStaffList(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
            })
            .catch(error => {
                console.error("Có lỗi xảy ra khi xóa nhân viên", error);
            });
    };

    const handleSearch = () => {
        const filterEmployee = staffList.filter(employee =>
            employee.name.toLowerCase().includes(searchName.toLowerCase())
        );
        setStaffList(filterEmployee);
    };

    const updateEmployee = (updatedEmployee) => {
        setStaffList(prevEmployees =>
            prevEmployees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
        setSelectedEmployee(null);
    };

    const viewEmployeeDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center bg-primary text-white py-2">Danh sách nhân viên văn phòng</h3>
            <div className="d-flex mb-3">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên nhân viên..."
                    className="form-control mr-2"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>Tìm</button>
            </div>
            <table className="table table-bordered">
                <thead>
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
                {staffList.map(staff => (
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
                            <button className="btn btn-info btn-sm" onClick={() => viewEmployeeDetails(staff)}>Xem
                            </button>
                            {' '}
                            <button className="btn btn-warning btn-sm" onClick={() => setSelectedEmployee(staff)}>Cập
                                nhật
                            </button>
                            {' '}
                            <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(staff.id)}>Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Staff;
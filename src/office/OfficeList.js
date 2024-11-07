import React, {useEffect, useState} from 'react';
import moment from 'moment';
import axios from 'axios';

function OfficeList() {

    const [staffList, setStaffList] = useState([]);
    useEffect(() => {
        axios.get("/staff")
            .then(response => {
                setStaffList(response.data);
            })
            .catch(error => {
                console.error("Có lỗi xảy ra khi tải danh sách nhân viên", error)
            })
    }, [])

    // const [searchName, setSearchName] = useState("");
    // const [selectedEmployee, setSelectedEmployee] = useState(null);
    //
    // const handleSearch = () => {
    //     const filterEmployee = staffList.filter(employee =>
    //         employee.includes(searchName)
    //     );
    //     setStaffList(filterEmployee);
    // };
    //
    // const updateEmployee = (updatedEmployee) => {
    //     setStaffList(prevEmployees =>
    //         prevEmployees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    //     );
    //     setSelectedEmployee(null);
    // };
    //
    // const deleteEmployee = (id) => {
    //     setStaffList(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
    // };
    //
    // const viewEmployeeDetails = (employee) => {
    //     setSelectedEmployee(employee);
    // };

    return (
        // <div className="container mt-4">
        //     <h3 className="text-center bg-primary text-white py-2">Danh sách nhân viên văn phòng</h3>
        //
        //     {/* Tìm kiếm */}
        //     <div className="d-flex mb-3">
        //         <input
        //             type="text"
        //             placeholder="Tìm kiếm theo tên nhân viên..."
        //             className="form-control mr-2"
        //             value={searchName}
        //             onChange={(e) => setSearchName(e.target.value)}
        //         />
        //         <button className="btn btn-primary" onClick={handleSearch}>Tìm</button>
        //     </div>
        //
        //     {/* Bảng danh sách nhân viên */}
        //     <table className="table table-bordered">
        //         <thead>
        //         <tr>
        //             <th>Mã nhân viên</th>
        //             <th>Họ tên</th>
        //             <th>Ngày sinh</th>
        //             <th>Giới tính</th>
        //             <th>Địa chỉ</th>
        //             <th>Điện thoại</th>
        //             <th>Email</th>
        //             <th>Lương</th>
        //             <th>Ngày làm việc</th>
        //             <th>Hành động</th>
        //         </tr>
        //         </thead>
        //         <tbody>
        //         {employees.map((emp) => (
        //             <tr key={emp.id}>
        //                 <td>{emp.employeeCode}</td>
        //                 <td>{emp.name}</td>
        //                 <td>{moment(emp.birthdate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
        //                 <td>{emp.gender}</td>
        //                 <td>{emp.address}</td>
        //                 <td>{emp.phone}</td>
        //                 <td>{emp.email}</td>
        //                 <td>{emp.salaryLevel}</td>
        //                 <td>{moment(emp.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
        //                 <td>
        //                     <button className="btn btn-info btn-sm" onClick={() => viewEmployeeDetails(emp)}>Xem
        //                     </button>
        //                     {' '}
        //                     <button className="btn btn-warning btn-sm" onClick={() => setSelectedEmployee(emp)}>Cập nhật
        //                     </button>
        //                     {' '}
        //                     <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(emp.id)}>Xóa
        //                     </button>
        //                 </td>
        //             </tr>
        //         ))}
        //         </tbody>
        //     </table>
        //
        //     {/* Chi tiết nhân viên */}
        //     {selectedEmployee && (
        //         <div className="modal show d-block" role="dialog">
        //             <div className="modal-dialog">
        //                 <div className="modal-content">
        //                     <div className="modal-header">
        //                         <h5 className="modal-title">Chi tiết nhân viên</h5>
        //                         <button className="close" onClick={() => setSelectedEmployee(null)}>&times;</button>
        //                     </div>
        //                     <div className="modal-body">
        //                         <p><strong>Mã nhân viên:</strong> {selectedEmployee.employeeCode}</p>
        //                         <p><strong>Họ tên:</strong> {selectedEmployee.name}</p>
        //                         <p><strong>Ngày sinh:</strong> {selectedEmployee.birthdate}</p>
        //                         <p><strong>Giới tính:</strong> {selectedEmployee.gender}</p>
        //                         <p><strong>Địa chỉ:</strong> {selectedEmployee.address}</p>
        //                         <p><strong>Điện thoại:</strong> {selectedEmployee.phone}</p>
        //                         <p><strong>Email:</strong> {selectedEmployee.email}</p>
        //                         <p><strong>Tên tài khoản:</strong> {selectedEmployee.username}</p>
        //                     </div>
        //                     <div className="modal-footer">
        //                         <button className="btn btn-secondary" onClick={() => setSelectedEmployee(null)}>Đóng
        //                         </button>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        // </div>
        <div className="container mt-4">
            <h3 className="text-center bg-primary text-white py-2">Danh sách nhân viên văn phòng</h3>
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
                        <td>{moment(emp.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
        ;
}

export default OfficeList;
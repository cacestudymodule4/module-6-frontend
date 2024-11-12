import React, {useEffect} from 'react';
import axios from "axios";

const ServiceList = () => {
    const [services, setServices] = React.useState([]);

    useEffect(() => {
    })
    const fetchServices = async () => {
        try{
            const response = await axios.get('http://localhost:8080/api/services', {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`}
            });
            setServices(response.data);
        }
        catch (error){
            console.error("Có lỗi xảy ra",error)
        }
    }
    return (
        <div className="service-table">
            <h2>DANH SÁCH DỊCH VỤ</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Tên Mặt Bằng</th>
                    <th>Tên Dịch Vụ</th>
                    <th>Định Kỳ</th>
                    <th>Đơn Vị Tính</th>
                    <th>Đơn Giá</th>
                    <th>Tiêu Thụ</th>
                    <th>Ngày Tháng</th>
                </tr>
                </thead>
                <tbody>
                {services.map((service) => (
                    <tr key={service.id}>
                        <td>{service.tenMatBang}</td>
                        <td>{service.tenDichVu}</td>
                        <td>{service.dinhKy}</td>
                        <td>{service.donViTinh}</td>
                        <td>{service.donGia.toLocaleString()} VND</td>
                        <td>{service.tieuThu.toLocaleString()}</td>
                        <td>{service.ngayThang}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceList;

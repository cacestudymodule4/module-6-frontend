import React from "react";
import axios from "axios";

function ContractPdfButton({contractId}) {
    const downloadPdf = async () => {
        try {
            // Gọi API từ Spring Boot
            const response = await axios.get(`http://localhost:8080/contracts/${contractId}/pdf`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                responseType: 'blob' // Để đảm bảo dữ liệu nhận về là dạng file nhị phân
            });
            // Tạo một URL từ dữ liệu PDF nhận được
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `contract_${contractId}.pdf`); // Đặt tên cho file PDF
            document.body.appendChild(link);
            link.click();
            // Dọn dẹp
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Có lỗi xảy ra khi tải file PDF:", error);
        }
    };
    return (
        <button onClick={downloadPdf}>
            Tải Hợp Đồng PDF
        </button>
    );
}

export default ContractPdfButton;
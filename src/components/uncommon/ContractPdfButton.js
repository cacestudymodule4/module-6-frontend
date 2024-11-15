import React, {useEffect} from "react";
import axios from "axios";
import {formatDate} from "./Salary";
import {useNavigate} from "react-router-dom";

function ContractPdfButton({contractId}) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const downloadPdf = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/contracts/${contractId}/pdf`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`},
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `contract_${formatDate()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Có lỗi xảy ra khi tải file PDF:", error);
        }
    };
    useEffect(() => {
        if (!token) navigate("/login");
    })
    return (
        <button onClick={downloadPdf}>
            Tải Hợp Đồng PDF
        </button>
    );
}

export default ContractPdfButton;
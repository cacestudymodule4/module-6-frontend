import React, {useState, useEffect} from 'react';
import {Form, Button, Row, Col, Card} from 'react-bootstrap';
import {useLocation, useParams} from 'react-router-dom';
import {useNavigate} from "react-router-dom";

function ContractDetail() {
    const navigate = useNavigate();
    const {id} = useParams();  // Lấy id từ URL
    const location = useLocation();  // Lấy state từ location
    const [contract, setContract] = useState(location.state?.contract || null);
    const currentDay = new Date();
    const startDate = new Date(contract.startDate);
    const endDate = new Date(contract.endDate);
    const status = endDate > currentDay ? 'Còn hiệu lực' : 'Het hiệu lực';
    const price = contract.ground.price
    const handleClick = () => {
        navigate('/contract/list');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-5" style={{color: "#6d757d"}}>Chi tiết hợp đồng</h2>
            <Form>
                <Card className="mb-4">
                    <Card.Header>
                        <h5>Thông tin khách hàng</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="customerName">
                                    <Form.Label>Tên khách hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.customer.name}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="customerName">
                                    <Form.Label>CMND</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.customer.identification}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="customerPhone">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.customer.address}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="customerEmail">
                                    <Form.Label>Ngày sinh</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={contract.customer.birthday}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="customerEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={contract.customer.email}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="customerAddress">
                                    <Form.Label>Số điện thoại khách hàng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.customer.phone}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                {/* Thông tin hợp đồng */}
                <Card className="mb-4">
                    <Card.Header>
                        <h5>Thông tin hợp đồng</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="contractId">
                                    <Form.Label>Mã số thuế</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.taxCode}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="contractId">
                                    <Form.Label>Trạng thái hợp đồng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={status}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="groundName">
                                    <Form.Label>Mã mặt bằng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={"MB" + contract.ground.id}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="contractId">
                                    <Form.Label>Kì hạng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.term + " tháng"}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="startDate">
                                    <Form.Label>Ngày bắt đầu</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={contract.startDate}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="endDate">
                                    <Form.Label>Ngày kết thúc</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={contract.endDate}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="deposit">
                                    <Form.Label>Giá tiền mỗi tháng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.ground.price + " VNĐ"}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="deposit">
                                    <Form.Label>Tổng tiền</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.totalPrice + " VNĐ"}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="deposit">
                                    <Form.Label>Tiền đặt cọc</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.deposit + " VNĐ"}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                {/* Thông tin nhân viên */}
                <Card className="mb-4">
                    <Card.Header>
                        <h5>Thông tin nhân viên</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="staffName">
                                    <Form.Label>Tên nhân viên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.staff.name}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="staffPhone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={contract.staff.phone}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="staffEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={contract.staff.email}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={contract.description}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={12} className="text-center">
                                <Button variant="secondary" onClick={handleClick}>
                                    Quay lại
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Form>
        </div>
    );
}

export default ContractDetail;

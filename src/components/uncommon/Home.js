import React, {useEffect, useState} from 'react';
import {Container, Form, Row, Col, Card, Button, Carousel, Image} from 'react-bootstrap';
import {NavbarApp} from '../common/Navbar';
import slide1 from '../../assets/img/bat-dong-san-1-35.png';
import slide2 from '../../assets/img/bat-dong-san-19.png';
import '../../assets/css/home.css';
import {FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaChartArea, FaBuilding} from 'react-icons/fa';
import Footer from '../common/Footer';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const [building, setBuilding] = useState({});
    const token = localStorage.getItem("jwtToken");
    const getBuildings = async () => {
        try {
            let config = {
                headers: {Authorization: `Bearer ${token}`}
            }
            const res = await axios.get(`http://localhost:8080/api/building`, config);
            if (res.status === 200) {
                setBuilding(res.data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!token) navigate('/login');
        getBuildings();
    }, [])
    return (
        <div className="App">
            <NavbarApp/>
            <Carousel fade interval={1500}>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={slide1}
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={slide2}
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={slide1}
                        alt="First slide"
                    />
                </Carousel.Item>
            </Carousel>
            {/* Services Section */}
            <Container bg="dark" className="py-5">
                <Row className='mb-4'>
                    <Col md={4} className='fw-bold fs-3'>Dịch vụ của công ty</Col>
                    <Col md={4}>Với trên 15 năm kinh nghiệm trong lĩnh vực Quản lý tòa nhà, cho thuê căn hộ, văn phòng
                        và môi giới các dự án Khu công nghiệp Hải Phòng</Col>
                    <Col md={4}>
                        <Image src="https://quanlychungcuhaiphong.vn/upload/icon/9-3-2024/lexico-53-70.png"/>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Img variant="top"
                                      src="https://quanlychungcuhaiphong.vn/upload/services/thumb/15-9-2020/quan-ly-van-hanh-1-75-18.png"/>
                            <Card.Body>
                                <Card.Title>Quản lý vận hành tòa nhà, chung cư và cụm chung cư</Card.Title>
                                <Card.Text>
                                    Với trên 14 năm kinh nghiệm trong công tác quản lý vận hành khai thác các Tòa nhà
                                    tại Hải Phòng. Công ty Lexico đã quản lý, vận hành nhà chung cư, tòa nhà căn hộ như
                                    là đơn vị Quản lý vận[...]
                                </Card.Text>
                                <Button variant="success">Learn More</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Img variant="top"
                                      src="https://quanlychungcuhaiphong.vn/upload/services/thumb/2-4-2022/duog6717-99.jpg"/>
                            <Card.Body>
                                <Card.Title>TƯ VẤN QUẢN LÝ VẬN HÀNH, SỬ DỤNG TÒA NHÀ CHUNG CƯ</Card.Title>
                                <Card.Text>
                                    Đơn vị chúng tôi nhận và thực hiện các công việc Quản lý vận hành khu chung cư cao
                                    tầng sau
                                </Card.Text>
                                <Button variant="success">Learn More</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Img variant="top"
                                      src="https://quanlychungcuhaiphong.vn/upload/services/thumb/20-7-2021/nho-2---copy-17.jpg"/>
                            <Card.Body>
                                <Card.Title>Dịch vụ kỹ thuật</Card.Title>
                                <Card.Text>
                                    Dịch vụ kỹ thuật tòa nhà chung cư văn phòng Công ty TNHH Thương Mại và Dịch Vụ Lê Xi
                                    cung cấp được quý khách đánh giá cao về chất lượng và sự tận tình. Được thành lập
                                    theo giấy phép đăng ký[...]
                                </Card.Text>
                                <Button variant="success">Learn More</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <div className="contact text-white py-5">
                <Container className="contact-section">
                    <Row className="justify-content-center contact-content">
                        <Col md={5} className="mb-5 contact-box">
                            <h2>THÔNG TIN LIÊN HỆ</h2>
                            <p><FaBuilding/> {building.name}</p>
                            <p><FaMapMarkerAlt/> {building.address}</p>
                            <p><FaPhoneAlt/> {building.phoneNumber}</p>
                            <p><FaChartArea/> {building.area} m<sup>2</sup></p>
                            <p><FaEnvelope/> {building.email}</p>
                        </Col>
                        <Col md={5}>
                            <h2>BIỂU MẪU LIÊN HỆ</h2>
                            <p>Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất.</p>
                            <Form>
                                <Form.Group controlId="formFullName">
                                    <Form.Control type="text" placeholder="Tên đầy đủ"/>
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Control type="email" placeholder="Địa chỉ Email"/>
                                </Form.Group>
                                <Form.Group controlId="formPhone" className="mt-3">
                                    <Form.Control type="text" placeholder="Số điện thoại"/>
                                </Form.Group>
                                <Form.Group controlId="formMessage" className="mt-3">
                                    <Form.Control as="textarea" rows={3} placeholder="Nội dung"/>
                                </Form.Group>
                                <Button style={{backgroundColor: "#019c41"}} type="submit" className="mt-3">
                                    Gửi liên hệ
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container bg="dark" className="py-5">
                <Row>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Img variant="top"
                                      src="https://quanlychungcuhaiphong.vn/upload/services/thumb/15-9-2020/quan-ly-van-hanh-1-75-18.png"/>
                            <Card.Body>
                                <Card.Title>Quản lý vận hành tòa nhà, chung cư và cụm chung cư</Card.Title>
                                <Card.Text>
                                    Với trên 14 năm kinh nghiệm trong công tác quản lý vận hành khai thác các Tòa nhà
                                    tại Hải Phòng. Công ty Lexico đã quản lý, vận hành nhà chung cư, tòa nhà căn hộ như
                                    là đơn vị Quản lý vận[...]
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Img variant="top"
                                      src="https://quanlychungcuhaiphong.vn/upload/services/thumb/2-4-2022/duog6717-99.jpg"/>
                            <Card.Body>
                                <Card.Title>TƯ VẤN QUẢN LÝ VẬN HÀNH, SỬ DỤNG TÒA NHÀ CHUNG CƯ</Card.Title>
                                <Card.Text>
                                    Đơn vị chúng tôi nhận và thực hiện các công việc Quản lý vận hành khu chung cư cao
                                    tầng sau
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Img variant="top"
                                      src="https://quanlychungcuhaiphong.vn/upload/services/thumb/20-7-2021/nho-2---copy-17.jpg"/>
                            <Card.Body>
                                <Card.Title>Dịch vụ kỹ thuật</Card.Title>
                                <Card.Text>
                                    Dịch vụ kỹ thuật tòa nhà chung cư văn phòng Công ty TNHH Thương Mại và Dịch Vụ Lê Xi
                                    cung cấp được quý khách đánh giá cao về chất lượng và sự tận tình. Được thành lập
                                    theo giấy phép đăng ký[...]
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    );
}

export default App;

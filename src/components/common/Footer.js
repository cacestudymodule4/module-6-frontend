import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../assets/css/footer.css';
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebookF,
    FaInstagram,
    FaTelegramPlane,
    FaLinkedinIn,
    FaTwitter
} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <Container className='text-white'>
                <Row>
                    <Col md={4}>
                        <div className="footer-logo">
                            <Row className='text-start'>
                                <Col>
                                    <h3 className='fw-bold'>Liên hệ</h3>
                                    <p><FaMapMarkerAlt /> 293 Nguyễn Tất Thành, Đà Nẵng</p>
                                    <p><FaPhoneAlt /> 0225.3736.686</p>
                                    <p><FaPhoneAlt /> 0906.182.555</p>
                                    <p><FaEnvelope /> thuydung.lexico@gmail.com</p></Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={4}>
                        <h3 className='fw-bold'>Liên kết hữu ích</h3>
                        <div className="links">
                            <Button variant="link" href="/home" style={{ color: 'white', fontWeight: 'bold' }}>Trang chủ</Button>
                            <br />
                            <Button variant="link" href="/floor/list" style={{ color: 'white', fontWeight: 'bold' }}>Quản lý tầng</Button>
                            <br />
                            <Button variant="link" href="/ground/list"
                                style={{ color: 'white', fontWeight: 'bold' }}>Quản lý mặt bằng</Button>
                            <br />
                            <Button variant="link" href="/report"
                                style={{ color: 'white', fontWeight: 'bold' }}>Báo cáo</Button>
                        </div>
                    </Col>
                    <Col md={4}>
                        <h3 className='fw-bold'>Theo dõi chúng tôi</h3>
                        <div style={iconContainerStyle}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <FaFacebookF />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <FaInstagram />
                            </a>
                            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <FaTelegramPlane />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <FaLinkedinIn />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <FaTwitter />
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

const headingStyle = {
    marginBottom: '10px',
};
const iconContainerStyle = {
    display: 'flex',
    gap: '20px',
};
const iconStyle = {
    color: '#fff',
    fontSize: '24px',
    textDecoration: 'none',
};

export default Footer;

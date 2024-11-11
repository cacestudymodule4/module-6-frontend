import "bootstrap/dist/css/bootstrap.css";
import React, {useEffect} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/salary.module.css';

const Salary = () => {
    return (
        <section className="py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="row gy-3 mb-3">
                            <div className="col-12 text-center">
                                <h2 className="text-uppercase m-0">Bảng Lương nhân viên</h2>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th scope="col" className="text-uppercase">#</th>
                                            <th scope="col" className="text-uppercase">Họ và tên</th>
                                            <th scope="col" className="text-uppercase">Vị trí</th>
                                            <th scope="col" className="text-uppercase">Lương</th>
                                        </tr>
                                        </thead>
                                        <tbody className="table-group-divider">
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                            <span
                                                className="fs-6 bsb-w-35 bsb-h-35 text-bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                                <i className="bi bi-twitter"></i>
                                            </span>
                                                    <div>
                                                        <h6 className="m-0">Twitter</h6>
                                                        <span className="text-secondary fs-7">SMM</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h6 className="mb-1">Oliver</h6>
                                                <span className="text-secondary fs-7">United States</span>
                                            </td>
                                            <td>
                                                <h6 className="mb-1">Bootstrap</h6>
                                                <span className="text-secondary fs-7">v5.3+</span>
                                            </td>
                                            <td className="text-end">$495</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                            <span
                                                className="fs-6 bsb-w-35 bsb-h-35 text-bg-success rounded-circle d-flex align-items-center justify-content-center me-2">
                                                <i className="bi bi-facebook"></i>
                                            </span>
                                                    <div>
                                                        <h6 className="m-0">Facebook</h6>
                                                        <span className="text-secondary fs-7">PPC</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <h6 className="mb-1">Emma</h6>
                                                <span className="text-secondary fs-7">United Kingdom</span>
                                            </td>
                                            <td>
                                                <h6 className="mb-1">WordPress</h6>
                                                <span className="text-secondary fs-7">v6.3+</span>
                                            </td>
                                            <td className="text-end">$950</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Salary;
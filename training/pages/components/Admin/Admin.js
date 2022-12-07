import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../AdminLayout/Layout';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import admin from '../../../styles/Admin.module.css';
import Sidenav from './SideNav';

export default function Admin() {
    const [modalShow, setModalShow] = useState(false);
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const [chooseDate, setChooseDate] = useState(firstDay);

    const [username, setUsername] = useState('');
    const [erp, setErp] = useState('');

    useEffect(() => {
        setUsername(sessionStorage.getItem('user'))
        setErp(sessionStorage.getItem('userId'))
    }, [])

    return (
        <Layout>
            <Head>
                <title>Админ хуудас</title>
                <link rel="icon" href="/images/getsitelogo.png" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            </Head>

            <div className='h-screen flex flex-row justify-start'>
                <Sidenav />
                <div className='w-full p-3'>
                    <h3>Content</h3>
                </div>
            </div>


            {/* <div className='my-3'>
                <div className='bg-[#2e3977] text-white w-1/3 md:w-1/6 text-center py-2 ml-[5%] rounded-md cursor-pointer' onClick={() => setModalShow(true)}>
                    Хэрэглэгч нэмэх
                </div>    
            </div> */}


            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow} onHide={() => setModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className='flex justify-center w-full'>
                        Хэрэглэгч нэмэх
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-5'>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Овог</Form.Label>
                            <Form.Control type="text" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Нэр</Form.Label>
                            <Form.Control type="text" placeholder="Password" />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Харьяалагдах хэлтэс</Form.Label>
                            <Select
                                className='select w-full'
                                placeholder="Харьяалагдах хэлтэс..."
                            />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Албан тушаал</Form.Label>
                            <Form.Control type="text" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Зэрэглэл</Form.Label>
                            <Select
                                className='select w-full'
                                placeholder="Зэрэглэл..."
                            />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Шууд удирдлага</Form.Label>
                            <Select
                                className='select w-full'
                                placeholder="Шууд удирдлага..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1 flex flex-col" controlId="formBasicPassword">
                            <Form.Label>Ажилд орсон хугацаа</Form.Label>
                            <DatePicker
                                className={`border rounded-md text-sm ${admin.datepicker}`}
                                selected={chooseDate}
                                showMonthDropdown={true}
                                onChange={(date) => { setChooseDate(date) }}
                            />
                        </Form.Group>
                    </Form>
                    <div className=''>
                        <p className='bg-[#2e3977] text-white w-1/3 text-center py-2 rounded-lg m-auto'>Нэмэх</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)} className="bg-slate-300">Close</Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    )
}

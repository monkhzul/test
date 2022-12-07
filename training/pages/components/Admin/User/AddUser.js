import React, { useRef, useState, useEffect } from 'react'
import Layout from '../../AdminLayout/Layout'
import SideNav from '../SideNav'
import Head from 'next/head'
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import admin from '../../../../styles/Admin.module.css';
import { toast, ToastContainer } from 'react-toastify';
import { PrismaClient } from '@prisma/client';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { useRouter } from 'next/router'
import * as XLSX from "xlsx";
import { Table } from 'rsuite';
import moment from 'moment';

export default function AddUser(props) {
    const router = useRouter();
    const [chooseDate, setChooseDate] = useState(new Date());
    const [users, setUsers] = useState([]);
    const [userTypeArray, setUserTypeArray] = useState(props.userType);
    const [departmentArray, setDepartmentArray] = useState(props.department);
    const { Column, HeaderCell, Cell } = Table;

    const [department, setDepartment] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [erp, setErp] = useState('');
    const [position, setPosition] = useState('');
    const [rank, setRank] = useState('');
    const [userType, setUserType] = useState('');

    const handleDepartment = (selectedOption) => {
        setDepartment(selectedOption.value)
    }
    const handleRanks = (selectedOption) => {
        setRank(selectedOption.value)
    }
    const handleUserTypes = (selectedOption) => {
        setUserType(selectedOption.value)
    }

    const departments = [];
    const ranks = [];
    const userTypes = [];

    for (var i = 1; i < 12; i++) {
        ranks.push({
            value: i,
            label: i
        })
    }

    for (var i in userTypeArray) {
        userTypes.push({
            value: userTypeArray[i].id,
            label: userTypeArray[i].name
        })
    }
    for (var i in departmentArray) {
        departments.push({
            value: departmentArray[i].department,
            label: departmentArray[i].department
        })
    }

    

    function AddUser() {
        if (department === '' || lastName === '' || firstName === '' || birthDate === '' ||
            erp === '' || position === '' || rank === '' || userType === '' || chooseDate === '') {
            toast("Бүх талбарыг бөглөнө үү!!!")
        } else {
            axios.post('/api/insert/insertUser', {
                department: department,
                lastName: lastName,
                firstName: firstName,
                birthDate: birthDate,
                erp: erp,
                position: position,
                rank: rank,
                userType: userType,
                chooseDate: chooseDate,
                company: 'M-Си-Эс Кока Кола',
                sysDate: new Date()
            }).then((res) => {
                console.log(res)
                toast("Амжилттай!")
                // router.reload(router.asPath)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    }

    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setUsers(jsonData)

        document.getElementById("table").style.display = 'block'

        function insertMany() {

            for (var i in jsonData) {
                var response = axios.post('/api/insert/insertUser', {
                    department: jsonData[i].department,
                    lastName: jsonData[i].lastName,
                    firstName: jsonData[i].firstName,
                    birthDate: jsonData[i].birthDate,
                    erp: jsonData[i].erp_code,
                    position: jsonData[i].position,
                    rank: jsonData[i].rank,
                    userType: jsonData[i].userType,
                    chooseDate: jsonData[i].date_of_employment,
                    company: 'M-Си-Эс Кока Кола',
                    sysDate: new Date()
                })
            }
            response.then((res) => {
                toast("Амжилттай!");
            })
            .catch(function (error) {
                console.log(error.response.status)
                if (error.response.status == 500) {
                    toast("Алдаа! Формат таарахгүй байна.")
                }
            })
        }
        insertMany();
    };

    return (
        <Layout>
            <Head>
                <title>Хэрэглэгч нэмэх</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <div className='flex flex-col sm:flex-row justify-start h-screen'>
                <SideNav />
                <ToastContainer
                    position='top-center'
                    autoClose={1800}
                />
                <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                    <h3 className='my-10'>Хэрэглэгч нэмэх</h3>
                    
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Овог</Form.Label>
                            <Form.Control type="text" placeholder="Овог" onChange={(e) => setLastName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Нэр</Form.Label>
                            <Form.Control type="text" placeholder="Нэр" onChange={(e) => setFirstName(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Төрсөн огноо</Form.Label>
                            <DatePicker
                                className={`border rounded-md text-sm ${admin.datepicker}`}
                                selected={birthDate}
                                showMonthDropdown={true}
                                onChange={(date) => { setBirthDate(date) }}
                                placeholderText='Төрсөн огноо'
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>ERP_Code</Form.Label>
                            <Form.Control type="number" placeholder="ERP_Code" onChange={(e) => setErp(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Харьяалагдах хэлтэс</Form.Label>
                            <CreatableSelect
                                className='select w-full'
                                placeholder="Харьяалагдах хэлтэс"
                                options={departments}
                                onChange={handleDepartment}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Албан тушаал</Form.Label>
                            <Form.Control type="text" placeholder="Албан тушаал" onChange={(e) => setPosition(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Зэрэглэл</Form.Label>
                            <Select
                                className='select w-full'
                                placeholder="Зэрэглэл"
                                options={ranks}
                                onChange={handleRanks}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Хэрэглэгчийн төрөл</Form.Label>
                            <CreatableSelect
                                className='select w-full'
                                placeholder="Хэрэглэгчийн төрөл"
                                options={userTypes}
                                onChange={handleUserTypes}
                            />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1 flex flex-col" controlId="formBasicPassword">
                            <Form.Label>Ажилд орсон огноо</Form.Label>
                            <DatePicker
                                className={`border rounded-md text-sm ${admin.datepicker}`}
                                selected={chooseDate}
                                showMonthDropdown={true}
                                onChange={(date) => { setChooseDate(date) }}
                                placeholderText="Ажилд орсон огноо"
                            />
                        </Form.Group>
                    </Form>
                    <div className='mb-5 mt-3'>
                        <p className='bg-[#2e3977] text-white text-center py-2 px-5 rounded-lg m-auto cursor-pointer' onClick={AddUser}>Нэмэх</p>
                    </div>

                    <div className='w-1/3 bg-[#648a7b] text-white p-2 text-center rounded text-base hover:bg-[#2d5646]'>
                        <input
                            className={`d-none`}
                            type="file"
                            id="file"
                            ref={inputRef}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={(e) => handleFileChange(e)}
                        />
                        <button
                            type="file"
                            id="fileSelect"
                            className=""
                            onClick={handleClick}
                        >
                            Листээр оруулах
                        </button>
                    </div>

                    <div className='w-full my-3' id='table'>
                        <Table
                            data={users}
                            onRowClick={rowData => {
                                console.log(rowData);
                            }}
                        >
                            <Column align="center" fixed>
                                <HeaderCell>ERP_Code</HeaderCell>
                                <Cell dataKey="erp_code" />
                            </Column>

                            <Column >
                                <HeaderCell>Компани</HeaderCell>
                                <Cell dataKey="company" />
                            </Column>

                            <Column width={200}>
                                <HeaderCell>Харьяалагдах хэлтэс</HeaderCell>
                                <Cell dataKey="department" />
                            </Column>

                            <Column >
                                <HeaderCell>Овог</HeaderCell>
                                <Cell dataKey="lastName" />
                            </Column>

                            <Column >
                                <HeaderCell>Нэр</HeaderCell>
                                <Cell dataKey="firstName" />
                            </Column>

                            <Column >
                                <HeaderCell>Төрсөн огноо</HeaderCell>
                                <Cell dataKey="birthDate" />
                            </Column>

                            <Column width={200}>
                                <HeaderCell>Албан тушаал</HeaderCell>
                                <Cell dataKey="position" />
                            </Column>

                            <Column >
                                <HeaderCell>Зэрэглэл</HeaderCell>
                                <Cell dataKey="rank" />
                            </Column>

                            <Column width={200}>
                                <HeaderCell>Ажилд орсон огноо</HeaderCell>
                                <Cell dataKey="date_of_employment" />
                            </Column>

                            <Column width={200}>
                                <HeaderCell>Хэрэглэгчийн төрөл</HeaderCell>
                                <Cell dataKey="userType" />
                            </Column>
                        </Table>
                    </div>
                </div>
            </div>

        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const res = await fetch('https://dummyjson.com/products')
    const db = await res.json()

    const userType = await prisma.user_Type.findMany()
    const department = await prisma.user.findMany({
        distinct: ['department']
    })
  
    const users = await prisma.user.findMany();

    return {
        props: {
            db: db,
            userType: JSON.parse(JSON.stringify(userType)),
            department: JSON.parse(JSON.stringify(department)),
            users: JSON.parse(JSON.stringify(users))
        }
    }
}
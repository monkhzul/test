import React, { useState, useEffect } from 'react';
import Layout from '../../AdminLayout/Layout';
import SideNav from '../SideNav';
import Head from 'next/head';
import Image from 'next/image';
import Form from 'react-bootstrap/Form';
import DateRangePicker from "rsuite/DateRangePicker";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { MultiSelect } from 'react-multi-select-component';
import { PrismaClient } from '@prisma/client';
import { Table } from 'rsuite';
import { CSVLink } from "react-csv";

export default function AddUser(props) {
    const router = useRouter();
    const [users, setUsers] = useState(props.users);
    const [view_course, setView_Course] = useState(props.view_course);
    const [level, setLevel] = useState([]);
    const [course, setCourse] = useState([]);
    const [erp, setErp] = useState([]);
    const { Column, HeaderCell, Cell } = Table;

    const erps = []; const courses = [];

    for (var i in view_course) {
        erps.push({
            value: (view_course[i].erp_code).toString(),
            label: (view_course[i].erp_code).toString(),
        })
        courses.push({
            value: view_course[i].course_name,
            label: `${view_course[i].courseName_ID} - ${view_course[i].course_name}`,
        })
    }

    const ERP = []; const Course = [];
    for (var i in erp) {
        ERP.push(Number(erp[i].value))
    }
    for (var i in course) {
        Course.push(course[i].value)
    }

    const chosenUsers = [];

    for (var i in view_course) {
        if ((ERP.includes(view_course[i].erp_code) && view_course[i].isComplete == 1) || (Course.includes(view_course[i].course_name) && view_course[i].isComplete == 1)) {
            chosenUsers.push({
                id: view_course[i].id,
                last_name: view_course[i].last_name,
                user_name: view_course[i].user_name,
                erp_code: view_course[i].erp_code,
                course_id: view_course[i].course_id,
                courseName_ID: view_course[i].courseName_ID,
                course_name: view_course[i].course_name,
                date_of_completion: view_course[i].date_of_completion.slice(0, 10),
                assessment: view_course[i].assessment,
                exam_score: view_course[i].exam_score,
                isCertificate: view_course[i].isCertificate === true ? 'Байгаа' : 'Байхгүй',
                certificateValidDate: view_course[i].certificateValidDate.slice(0, 10),
                viewed_detail: view_course[i].viewed_detail,
                isComplete: view_course[i].isComplete,
                startDate: view_course[i].startDate.slice(0, 10),
                endDate: view_course[i].endDate.slice(0, 10)
            })
        }
    }


    return (
        <Layout>
            <Head>
                <title>Нийт хэрэглэгчидийн үзсэн сургалт</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <div className='flex flex-col sm:flex-row justify-start h-screen p-3'>
                <SideNav />
                <ToastContainer
                    position='top-center'
                    autoClose={1500}
                />
                <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                    <h4 className='my-3'>Нийт хэрэглэгчидийн үзсэн сургалт</h4>
                    <div className='w-full my-3'>
                        <Form.Group className="" controlId="formBasicPassword">

                            <div className='mt-5'>
                                <Form.Label>ERP кодоор</Form.Label>
                                <MultiSelect
                                    options={erps}
                                    value={erp}
                                    labelledBy={"Choose a category..."}
                                    onChange={setErp}
                                    hasSelectAll={true}
                                    className='mx-auto w-full'
                                />
                            </div>
                        </Form.Group>
                    </div>

                    <div className='w-full flex flex-col justify-center items-center'>
                        <div className='my-2 w-full'>
                            <Form.Label>Сургалтаар</Form.Label>
                            <MultiSelect
                                options={courses}
                                value={course}
                                labelledBy={"Choose a course..."}
                                onChange={setCourse}
                                hasSelectAll={true}
                                className='mx-auto mb-2'
                            />
                        </div>
                    </div>

                    <div className='mt-5 w-full'>
                        <h4>Хэрэглэгчид</h4>
                        <div className='w-full my-3 shadow-2xl'>
                            <Table
                                height={400}
                                data={chosenUsers}
                                onRowClick={rowData => { rowData }}
                            >

                                <Column align="center" fixed>
                                    <HeaderCell>ERP_Code</HeaderCell>
                                    <Cell dataKey="erp_code" />
                                </Column>

                                <Column width={150}>
                                    <HeaderCell>Овог</HeaderCell>
                                    <Cell dataKey="last_name" />
                                </Column>

                                <Column width={150} className="">
                                    <HeaderCell>Нэр</HeaderCell>
                                    <Cell dataKey="user_name" />
                                </Column>

                                <Column width={200}>
                                    <HeaderCell>Сургалтын ID</HeaderCell>
                                    <Cell dataKey="courseName_ID" />
                                </Column>

                                <Column width={250}>
                                    <HeaderCell>Сургалтын нэр</HeaderCell>
                                    <Cell dataKey="course_name" />
                                </Column>

                                <Column width={150}>
                                    <HeaderCell>Үзэж дуусгасан огноо</HeaderCell>
                                    <Cell dataKey="date_of_completion" />
                                </Column>

                                <Column width={100}>
                                    <HeaderCell>Үнэлгээ</HeaderCell>
                                    <Cell dataKey="assessment" />
                                </Column>

                                <Column width={100}>
                                    <HeaderCell>Шалгалтын оноо</HeaderCell>
                                    <Cell dataKey="exam_score" />
                                </Column>

                                <Column width={150}>
                                    <HeaderCell>Сертификаттай эсэх</HeaderCell>
                                    <Cell dataKey={`isCertificate`} />
                                </Column>

                                <Column width={200}>
                                    <HeaderCell>Сертификатын хүчинтэй хугацаа</HeaderCell>
                                    <Cell dataKey="certificateValidDate" />
                                </Column>

                            </Table>
                        </div>
                        <p className='my-4'>Нийт: {chosenUsers.length} хэрэглэгч</p>
                    </div>

                    <div className='mt-14 mb-28'>
                        <div className='bg-gray-400 text-white text-center flex px-3 rounded-lg mb-28 cursor-pointer'>
                            <CSVLink
                                data={chosenUsers}
                                filename="data"
                                className={`text-white flex`}
                            >
                                <Image
                                    src="/images/excel.svg"
                                    alt=""
                                    width={100}
                                    height={50}
                                    className={`p-2`}
                                />
                                <p className={`my-auto font-mono text-base`}> Export To Excel </p>
                            </CSVLink>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const users = await prisma.user.findMany();

    const view_course = await prisma.user_Viewed_Course.findMany();

    return {
        props: {
            users: JSON.parse(JSON.stringify(users)),
            view_course: JSON.parse(JSON.stringify(view_course))
        }
    }
}

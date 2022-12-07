import React, { useState, useEffect } from 'react'
import Layout from '../../AdminLayout/Layout'
import SideNav from '../SideNav'
import Head from 'next/head'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client';
import { Table } from 'rsuite';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';

export default function AddUser(props) {
  const router = useRouter();
  const [course, setCourse] = useState(props.course);

  const { Column, HeaderCell, Cell } = Table;

  function updateConfirm(id, last_name, user_name, erp_code, course_id, courseName_ID, course_name, startDate, endDate) {
    var req = axios.post('/api/insert/insertAccessUser', {
      last_name: last_name,
      user_name: user_name,
      erp_code: erp_code,
      course_id: course_id,
      courseName_ID: courseName_ID,
      course_name: course_name,
      date_of_completion: "",
      assessment: "",
      exam_score: "",
      isCertificate: "",
      certificateValidDate: "",
      viewed_detail: 0,
      isComplete: false,
      startDate: startDate,
      endDate: endDate
    })

    req.then((res) => {
      if (res.status == 200) {
        toast('Хүсэлтийг зөвшөөрлөө !!!')
        axios.post('/api/delete/deleteRequest', {
          id: id
        })

        router.reload(router.asPath);
      }
    })
  }

  function deleteRequest(id) {
    const req = axios.post('/api/delete/deleteRequest', {
      id: id
    })

    req.then((res) => {
      if (res.status == 200) {
        toast('Хүсэлт цуцлагдлаа!!!')
      }

      router.reload(router.asPath);
    })
  }

  return (
    <Layout>
      <Head>
        <title>Хэрэглэгчийн илгээсэн хүсэлтүүд</title>
        <link rel="icon" href="/images/getsitelogo.png" />
      </Head>
      <div className='flex flex-col sm:flex-row justify-start h-screen p-3'>
        <SideNav />
        <ToastContainer
          position='top-center'
          autoClose={1500}
        />
        <div className='w-full px-5 mb-10 md:px-28 flex flex-col items-center'>
          <h4 className='my-3'>Хэрэглэгчийн илгээсэн хүсэлтүүд</h4>
          <div className='w-full my-3'>

            <div className='mt-5'>
              <div className='w-full my-3 shadow-2xl'>
                <Table
                  height={400}
                  data={course}
                  onRowClick={rowData => {
                    console.log(rowData);
                  }}
                // locale={{emptyMessage: "No Data"}}
                >

                  <Column align="center" fixed>
                    <HeaderCell>ERP_Code</HeaderCell>
                    <Cell dataKey="erp_code" />
                  </Column>

                  <Column width={200}>
                    <HeaderCell>Овог</HeaderCell>
                    <Cell dataKey="last_name" />
                  </Column>

                  <Column width={200}>
                    <HeaderCell>Нэр</HeaderCell>
                    <Cell dataKey="user_name" />
                  </Column>

                  <Column width={300}>
                    <HeaderCell>Сургалтын нэр</HeaderCell>
                    <Cell dataKey="course_name" />
                  </Column>

                  <Column width={200}>
                    <HeaderCell>Сургалтын ID</HeaderCell>
                    <Cell dataKey="courseName_ID" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Сургалтын төрөл</HeaderCell>
                    <Cell dataKey="course_type" />
                  </Column>

                  <Column width={80} className="text-center" fixed='right'>
                    <HeaderCell>Зөвшөөрөх</HeaderCell>
                    <Cell>
                      {rowData => (
                        <span>
                          <CheckIcon className='cursor-pointer bg-green-800 text-gray-50 rounded-sm text-2xl hover:text-white hover:bg-green-500'
                            onClick={() => updateConfirm(rowData.id, rowData.last_name, rowData.user_name, rowData.erp_code, rowData.course_id, rowData.courseName_ID, rowData.course_name, rowData.startDate, rowData.endDate)}>
                          </CheckIcon>
                        </span>
                      )}
                    </Cell>
                  </Column>
                  <Column width={80} className="text-center" fixed='right'>
                    <HeaderCell>Цуцлах</HeaderCell>
                    <Cell>
                      {rowData => (
                        <span>
                          <CloseIcon className='cursor-pointer text-2xl bg-red-900 text-gray-50 rounded-sm hover:text-white hover:bg-red-500'
                            onClick={() => deleteRequest(rowData.id)}></CloseIcon>
                        </span>
                      )}
                    </Cell>
                  </Column>

                </Table>
              </div>
              <p className='my-4'>Нийт: {course.length} хэрэглэгч</p>
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

  const course = await prisma.course_Request.findMany();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      course: JSON.parse(JSON.stringify(course))
    }
  }
}

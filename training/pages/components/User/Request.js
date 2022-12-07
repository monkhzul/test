import React, { useState, useEffect } from 'react'
import Layout from '../Layout/Layout'
import Head from 'next/head'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client';
import { Table } from 'rsuite';
import CloseIcon from '@rsuite/icons/Close';

export default function AddUser(props) {
  const router = useRouter();
  const [course, setCourse] = useState(props.course);
  const [erp, setErp] = useState('');

  useEffect(() => {
    setErp(sessionStorage.getItem('userId'))
  },[])

  const { Column, HeaderCell, Cell } = Table;


  function deleteRequest(id) {
    const req = axios.post('/api/delete/deleteRequest', {
        id: id
    })

    req.then((res) => {
        console.log(res)
        if (res.status == 200) {
            toast('Хүсэлт цуцлагдлаа!!!')
        }

        router.reload(router.asPath);
    })
  }

  const result = course.filter(itemInArray => itemInArray.erp_code === Number(erp));

  return (
    <Layout>
      <Head>
        <title>Илгээсэн хүсэлт</title>
        <link rel="icon" href="/images/getsitelogo.png" />
      </Head>
      <div className='flex flex-col sm:flex-row justify-start p-3'>
        <ToastContainer
          position='top-center'
          autoClose={1500}
        />
        <div className='w-full px-5 mb-10 md:px-28 flex flex-col items-center'>
          <h4 className='my-3'>Таны илгээсэн хүсэлт</h4>
          <div className='w-full my-3'>

            <div className='mt-5'>
              <div className='w-full my-3 shadow-2xl'>
                <Table
                  height={400}
                  data={result}
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

                  <Column width={300}>
                    <HeaderCell>Сургалтын ID</HeaderCell>
                    <Cell dataKey="courseName_ID" />
                  </Column>

                  <Column width={200}>
                    <HeaderCell>Сургалтын төрөл</HeaderCell>
                    <Cell dataKey="course_type" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Төлөв</HeaderCell>
                    <Cell dataKey="state" />
                  </Column>

                    <Column width={100} className="text-center" fixed='right'>
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
              <p className='my-4'>Нийт: {result.length} хүсэлт</p>
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

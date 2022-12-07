import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import course from '../../../styles/Course.module.css';
import { PrismaClient } from '@prisma/client';
import ReactPaginate from 'react-paginate';
import Icon from '@rsuite/icons/legacy/Diamond'

export default function AddUser(props) {
    const router = useRouter();
    const [view_course, setViewCourse] = useState(props.view_course);
    const [pageNumber, setPageNumber] = useState(0);

    const [erp, setErp] = useState(0);
    const [username, setUsername] = useState('');

    useEffect(() => {
        setUsername(sessionStorage.getItem('user'))
        setErp(sessionStorage.getItem('userId'))
    }, [])

    const perPage = 8;
    const pagesVisited = pageNumber * perPage;

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    const viewCourses = [];

    for (var i in view_course) {
            if (view_course[i].erp_code === Number(erp) && view_course[i].isComplete == 1) {
                viewCourses.push({
                    id: view_course[i].id,
                    last_name: view_course[i].last_name,
                    user_name: view_course[i].user_name,
                    erp_code: view_course[i].erp_code,
                    courseName_ID: view_course[i].courseName_ID,
                    course_name: view_course[i].course_name,
                    date_of_completion: view_course[i].date_of_completion,
                    assessment: view_course[i].assessment,
                    isCertificate: view_course[i].isCertificate,
                    certificateValidDate: view_course[i].certificateValidDate,
                    startDate: view_course[i].startDate.slice(0,10),
                    endDate: view_course[i].endDate.slice(0,10),
                    sysDate: view_course[i].sysDate,
                })
            }
    }

    const pageCount = Math.ceil(viewCourses.length / perPage);

    viewCourses.sort(
        (objA, objB) =>
            new Date(objB.sysDate) - new Date(objA.sysDate)
    );

    return (
        <Layout>
            <Head>
                <title>Үзсэн сургалтууд</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <div className='flex flex-col sm:flex-row justify-start'>
                <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                    <div className="mt-5">
                        <h3 className="flex justify-center text-[#2e3977] my-3">Таны үзсэн сургалтууд</h3>
                    </div>

                    <div className='w-full text-center'>
                        {viewCourses.length === 0 ?
                            <div className='text-gray-400 text-lg'>
                                Таньд үзэж дуусгасан сургалт байхгүй байна!
                            </div>
                            :
                            <div className='w-full flex justify-center'>
                                {viewCourses.slice(pagesVisited, pagesVisited + perPage)
                                    .map((data, i) =>
                                        <div className={`${course.cardBody} border`} key={i}>
                                            <div className='flex mx-auto'>
                                                <Icon style={{ color: '#ffb300', fontSize: 24, marginBlock: 'auto' }} />
                                                <h4 className="mx-3">{data.course_name}</h4>
                                            </div>
                                            <div className='my-2'>
                                                <div className='flex justify-between mt-2'>
                                                    <p>Овог: </p>
                                                    <div>{data.last_name}</div>
                                                </div>
                                                <div className='flex justify-between mt-2'>
                                                    <p>Нэр: </p>
                                                    <div>{data.user_name}</div>
                                                </div>
                                                <div className='flex justify-between mt-2'>
                                                    <p>Сургалтын ID: </p>
                                                    <div>{data.courseName_ID}</div>
                                                </div>
                                                <div className='flex justify-between items-center my-1'>
                                                    <p className=''>Үнэлгээ: </p>
                                                    <div className=''>{data.assessment}</div>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <p className=''>Үзэж дуусгасан огноо: </p>
                                                    <div className=''>{data.date_of_completion.slice(0,10)}</div>
                                                </div>
                                                <div className='flex justify-between items-center my-1'>
                                                    <p className=''>Сертификаттай эсэх: </p>
                                                    <div className=''>{data.assessment == 1 ? 'Сертификаттай': 'Сертификатгүй'}</div>
                                                </div>
                                                {data.isCertificate == 1 ? 
                                                <div className='flex justify-between items-center'>
                                                    <p className=''>Сертификатын хүчинтэй хугацаа: </p>
                                                    <div className=''>{data.certificateValidDate}</div>
                                                </div> 
                                                : ''}
                                                
                                            </div>
                                        </div>
                                    )}
                            </div>
                        }
                    </div>
                    <div className='mt-5'>
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                pageCount={pageCount}
                                onPageChange={changePage}
                                containerClassName={"paginationBttns"}
                                previousLinkClassName={"previousBttn"}
                                nextLinkClassName={"nextBttn"}
                                disabledClassName={"paginationDisabled"}
                                activeClassName={"paginationActive"}
                            />
                        </div>
                </div>
            </div>
        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const course = await prisma.course.findMany();
    const view_course = await prisma.user_Viewed_Course.findMany();

    const type = await prisma.course.findMany({
        distinct: ['type']
    })

    return {
        props: {
            course: JSON.parse(JSON.stringify(course)),
            type: JSON.parse(JSON.stringify(type)),
            view_course: JSON.parse(JSON.stringify(view_course))
        }
    }
}
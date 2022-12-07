import React, { useState, useEffect } from 'react';
import Layout from '../../AdminLayout/Layout';
import SideNav from '../SideNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import course from '../../../../styles/Course.module.css';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { MultiSelect } from 'react-multi-select-component';
import { PrismaClient } from '@prisma/client';

export default function AddUser(props) {
    const router = useRouter();
    const [data, setData] = useState(props.db);
    const [types, setType] = useState(props.type);
    const [pageNumber, setPageNumber] = useState(0);
    const [category, setCategory] = useState([]);
    const perPage = 8;
    const pagesVisited = pageNumber * perPage;

    data.sort(
        (objA, objB) => 
        new Date(objB.sysDate) - new Date(objA.sysDate)
    );

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    const title = [];
    const type = [];

    for (var i in types) {
        title.push({
            value: types[i].type,
            label: types[i].type
        })
    }
    for (var i in category) {
        type.push(category[i].value)
    }

    const chosenCourses = [];

    for (var i in data) {
        if (type.includes(data[i].type)) {
            chosenCourses.push({
                id: data[i].id,
                name: data[i].name,
                type: data[i].type,
                duration: data[i].duration,
                courseLevel: data[i].courseLevel,
                trainingType: data[i].trainingType,
                sessionDates: data[i].sessionDates,
                fileName: data[i].fileName,
                filePath: data[i].filePath,
                startDate: data[i].startDate,
                endDate: data[i].endDate,
                sysDate: data[i].sysDate,
                description: data[i].description,
            })
        }
    }

    const pageCount = Math.ceil(chosenCourses.length === 0 ? data.length / perPage : chosenCourses.length / perPage);

    function ViewCourse(id) {
        sessionStorage.setItem('course_id', id);
        router.push({
            pathname: '/components/Admin/Course/ViewCourse'
        })
    }

    return (
        <Layout>
            <Head>
                <title>Сургалтууд</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <div className='flex flex-col sm:flex-row justify-start h-screen'>
                <SideNav />
                <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                    <div className={`flex flex-col ${course.Courses}`}>
                        <div className='my-5 text-center text-base font-semibold'>
                            <label className='mb-3 text-gray-500 mx-auto w-[90%]'>Choose a category</label>
                            <MultiSelect
                                options={title}
                                value={category}
                                labelledBy={"Choose a category..."}
                                onChange={setCategory}
                                hasSelectAll={false}
                                className='mx-auto w-[90%]'
                            />
                        </div>
                        <div className={`${course.courseCards}`}>
                            <div className="">
                                <h5 className="flex justify-center text-[#2e3977] my-3">Сургалтууд</h5>
                            </div>
                            <div className={`${course.cards}`}>
                                {
                                    chosenCourses.length === 0 ? data.slice(pagesVisited, pagesVisited + perPage)
                                        .map((data, i) =>
                                            <div className={`${course.cardBody} border`} key={i}>
                                                <h5 className="mx-auto">{data.name}</h5>
                                                <div className='my-2'>
                                                    <div className='flex justify-between'>
                                                        <p>Эхлэх хугацаа: </p>
                                                        <div>{data.startDate.slice(0, 10)}</div>
                                                    </div>
                                                    <div className='flex justify-between items-center'>
                                                        <p className=''>Дуусах хугацаа: </p>
                                                        <div className=''>{data.endDate.slice(0, 10)}</div>
                                                    </div>
                                                </div>
                                                <div className={`${course.cardContent}`}>
                                                    {data.description.length > 50 ? `${data.description.slice(0,50)}...` : data.description}
                                                </div>
                                                <div className={`${course.cardFooter}`}>
                                                <p className={`${course.cardLink} my-auto bg-gray-300 py-1 px-4`}
                                                    onClick={() => ViewCourse(data.id)}>Дэлгэрэнгүй</p>
                                                </div>
                                            </div>
                                        )
                                        : chosenCourses.slice(pagesVisited, pagesVisited + perPage)
                                            .map((data, i) =>
                                                <div className={`${course.cardBody} border`} key={i}>
                                                    <h5 className="mx-auto">{data.name}</h5>
                                                    <div className='my-2'>
                                                        <div className='flex justify-between'>
                                                            <p className=''>Эхлэх хугацаа: </p>
                                                            <div className=''>{data.startDate.slice(0, 10)}</div>
                                                        </div>
                                                        <div className='flex justify-between items-center'>
                                                            <p className=''>Дуусах хугацаа: </p>
                                                            <div className=''>{data.endDate.slice(0, 10)}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`${course.cardContent}`}>
                                                        {data.description}
                                                    </div>
                                                    <div className={`${course.cardFooter}`}>
                                                    <p className={`${course.cardLink} my-auto bg-gray-300 py-1 px-4`}
                                                    onClick={() => ViewCourse(data.id)}>Дэлгэрэнгүй</p>
                                                    </div>
                                                </div>
                                            )
                                }
                            </div>
                        </div>
                        <div className=''>
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
            </div>
        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const res = await prisma.course.findMany();
    const db = JSON.parse(JSON.stringify(res))

    const type = await prisma.course.findMany({
        distinct: ['type']
    })

    return {
        props: {
            db: db,
            type: JSON.parse(JSON.stringify(type))
        }
    }
}
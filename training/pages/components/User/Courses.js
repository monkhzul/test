import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import course from '../../../styles/Course.module.css';
import { MultiSelect } from 'react-multi-select-component';
import { PrismaClient } from '@prisma/client';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'rsuite';
import RemindIcon from '@rsuite/icons/legacy/Remind';
import Pagination from 'rsuite/Pagination';
import axios from 'axios';

export default function AddUser(props) {
    const router = useRouter();
    const [data, setData] = useState(props.course);
    const [types, setType] = useState(props.type);
    const [view_course, setViewCourse] = useState(props.view_course);
    const [req_course, setReqCourse] = useState(props.req_course);
    const [pageNumber, setPageNumber] = useState(0);
    const [category, setCategory] = useState([]);
    const [cid, setCid] = useState('');

    const [open, setOpen] = useState(false);

    const [erp, setErp] = useState('');
    const [username, setUsername] = useState('');
    const [lastname, setLastname] = useState('');

    useEffect(() => {
        setUsername(sessionStorage.getItem('user'))
        setLastname(sessionStorage.getItem('lastname'))
        setErp(sessionStorage.getItem('userId'))
    }, [])

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

    const view = [];

    for (var i in view_course) {
        if (view_course[i].erp_code === Number(erp)) {
            view.push(view_course[i].course_id)
        }
    }

    const viewCourses = [];

    for (var i in data) {
        if (view.includes(data[i].id)) {
            if (new Date(data[i].endDate).getTime() >= new Date().getTime()) {
                viewCourses.push({
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
    }

    const pageCount = Math.ceil(chosenCourses.length === 0 ? data.length / perPage : chosenCourses.length / perPage);

    function ViewCourse(id) {
        sessionStorage.setItem("course_id", id)

        router.push({
            pathname: '/components/User/ViewCourse'
        })

    }

    const [selectCourse, setSelectCourse] = useState([]);
    function SendRequest(id) {
        sessionStorage.setItem("course_id", id);
        setOpen(true)
        setCid(id)
        const select = [];

        for (var i in data) {
            if (data[i].id === id) {
                select.push({
                    id: data[i].id,
                    name: data[i].name,
                    type: data[i].type,
                    duration: data[i].duration,
                    courseName_ID: data[i].courseName_ID,
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
        setSelectCourse(select)
    }


    const req = [];

    for (var i in req_course) {
        if (req_course[i].erp_code === Number(erp)) {
            req.push(Number(req_course[i].course_id))
        }
    }

    function Continue() {
        const result = axios.post('/api/insert/insertCourseRequest', {
            user_name: username,
            last_name: lastname,
            erp_code: erp,
            course_id: selectCourse[0].id,
            course_name: selectCourse[0].name,
            courseName_ID: selectCourse[0].courseName_ID,
            course_type: selectCourse[0].type,
            startDate: selectCourse[0].startDate,
            endDate: selectCourse[0].endDate,
            sysDate: new Date(),
            state: 'Хүлээгдэж буй'
        })

        result.then((res) => {
            if (res.status == 200) {
                toast('Хүсэлт амжилттай илгээгдлээ!')
            } else {
                toast('Error')
            }
        })

        setOpen(false)

    }

    const [limit, setLimit] = useState(8);
    const [page, setPage] = useState(1);

    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };

    const dataTable = chosenCourses.length == 0 ? data.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return (i >= start && i < end);
    }) : chosenCourses.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return (i >= start && i < end);
    });


    return (
        <Layout>
            <Head>
                <title>Сургалтууд</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                <div className="mt-5">
                    <h3 className="flex justify-center text-[#2e3977] my-3">Таны сургалтууд</h3>
                </div>
                <ToastContainer
                    position='top-center'
                    autoClose={1500}
                />

                <div className='w-full'>
                    {viewCourses.length === 0 ?
                        <div className='text-gray-400 text-lg text-center'>
                            Таньд сургалт үзэх эрх байхгүй байна!
                        </div>
                        :
                        <div className={`${course.courseCards}`}>
                            <div className={`${course.cards}`}>
                                {viewCourses.slice(pagesVisited, pagesVisited + perPage)
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
                                                {data.description.length > 50 ? `${data.description.slice(0, 50)}...` : data.description}
                                            </div>
                                            <div className={`${course.cardFooter}`}>
                                                <p className={`${course.cardLink} my-auto bg-gray-300 py-1 px-4`}
                                                    onClick={() => ViewCourse(data.id)}>Сургалт үзэх</p>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='flex flex-col justify-start h-screen'>

                <div className={`flex flex-col ${course.Courses} mt-5`}>
                    <div className='my-5 text-center text-base font-semibold'>
                        <h3 className='mb-3 text-gray-500 mx-auto w-[90%]'>Бүх сургалт</h3>
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
                        <div className={`${course.cards}`}>
                            {
                                dataTable.length === 0 ? data
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
                                                {data.description.length > 50 ? `${data.description.slice(0, 50)}...` : data.description}
                                            </div>
                                            <div className={`${course.cardFooter}`}>
                                                {
                                                    view.includes(data.id) ? '' :
                                                        req.includes(data.id) ?
                                                            <h5 className={`${course.cardLink} my-auto bg-gray-300 h6y-1 px-4`}
                                                            >Хүсэлт илгээгдсэн байна</h5> :
                                                            <h6 className={`${course.cardLink} my-auto bg-gray-300 h6y-1 px-4`}
                                                                onClick={() => SendRequest(data.id)}>Хүсэлт илгээх</h6>
                                                }
                                            </div>
                                        </div>
                                    )
                                    : dataTable
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
                                                    {data.description.length > 50 ? `${data.description.slice(0, 50)}...` : data.description}
                                                </div>
                                                <div className={`${course.cardFooter}`}>
                                                    {
                                                        view.includes(data.id) ? '' :
                                                            req.includes(data.id) ?
                                                                <h5 className={`${course.cardLink} my-auto bg-gray-300 h6y-1 px-4`}
                                                                >Хүсэлт илгээгдсэн байна</h5> :
                                                                <h6 className={`${course.cardLink} my-auto bg-gray-300 h6y-1 px-4`}
                                                                    onClick={() => SendRequest(data.id)}>Хүсэлт илгээх</h6>
                                                    }
                                                </div>
                                            </div>
                                        )
                            }
                        </div>
                    </div>
                    <div className='my-5 mx-auto w-[90%] flex justify-center'>
                        <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            maxButtons={5}
                            size="lg"
                            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                            total={chosenCourses.length == 0 ? data.length : chosenCourses.length}
                            limitOptions={[8, 15, 20]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimit}
                            className='flex flex-col lg:flex-row'
                        />
                    </div>
                </div>

                <Modal open={open} onClose={() => setOpen(false)} size="sm">
                    <Modal.Body>
                        {/* <RemindIcon style={{ color: '#ffb300', fontSize: 24 }} /> */}
                        {selectCourse.map((course) =>
                            <div className='flex flex-col'>
                                <h4 className='text-center mb-3'>{course.name}</h4>
                                <div className='flex flex-col ml-5 shadow-xl'>
                                    <p className='text-gray-500 text-base'>Сургалтын төрөл: <span className='text-lg ml-10 font-semibold text-black'> {course.type} </span> </p>
                                    <p className='text-gray-500 text-base'>Сургалтын эхлэх хугацаа: <span className='text-lg ml-10 font-semibold text-black'> {course.startDate.slice(0, 10)} </span> </p>
                                    <p className='text-gray-500 text-base'>Сургалтын дуусах хугацаа: <span className='text-lg ml-10 font-semibold text-black'> {course.endDate.slice(0, 10)} </span> </p>
                                    <p className='text-gray-500 text-base'>Сургалтын тодорхойлолт: <span className='text-lg ml-10 font-semibold text-black'> {course.description} </span> </p>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => Continue(false)} appearance="primary" className='text-white'>
                            Хүсэлт илгээх
                        </Button>
                        <Button onClick={() => setOpen(false)} appearance="ghost">
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const course = await prisma.course.findMany();
    const view_course = await prisma.user_Viewed_Course.findMany();
    const req_course = await prisma.course_Request.findMany();

    const type = await prisma.course.findMany({
        distinct: ['type']
    })

    return {
        props: {
            course: JSON.parse(JSON.stringify(course)),
            type: JSON.parse(JSON.stringify(type)),
            req_course: JSON.parse(JSON.stringify(req_course)),
            view_course: JSON.parse(JSON.stringify(view_course))
        }
    }
}
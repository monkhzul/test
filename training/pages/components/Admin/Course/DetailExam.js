import React, { useState, useEffect } from 'react';
import Layout from '../../AdminLayout/Layout';
import SideNav from '../SideNav';
import Head from 'next/head';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { PrismaClient } from '@prisma/client';

export default function AddUser(props) {

    const [course, setCourse] = useState(props.course);
    const [courseDetail, setCourseDetail] = useState(props.courseDetail);
    const [chosenCourse, setChosenCourse] = useState('');
    const [chosenDetail, setChosenDetail] = useState('');
    const router = useRouter();

    const courses = []; const chosens = []; const courseDetails = [];

    for (var i in course) {
        courses.push({
            value: course[i].id,
            label: course[i].name,
        })
    }

    const selectCourse = (value) => {
        setChosenCourse(value);
        setChosenDetail('');
    }

    for (var i in courseDetail) {
        if (chosenCourse == '' || chosenCourse == null) {

        } else {
            if (chosenCourse.value === courseDetail[i].courseID && courseDetail[i].isExam == 1) {
                chosens.push({
                    id: courseDetail[i].id,
                    name: courseDetail[i].name,
                    courseID: courseDetail[i].courseID,
                    videoName: courseDetail[i].videoName,
                    isExam: courseDetail[i].isExam
                })
            }
        }
    }

    for (var i in chosens) {
        courseDetails.push({
            value: chosens[i].id,
            label: chosens[i].name,
        })
    }

    const [serviceList, setServiceList] = useState([{ service: "" }]);

    const handleServiceAdd = () => {
        setServiceList([...serviceList, { service: "" }]);
    }

    const handleServicRemove = (index) => {
        const list = [...serviceList];
        list.splice(index, 1);
        setServiceList(list);
    }

    const handleServiceChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...serviceList];
        list[index][name] = value;
        setServiceList(list)
    }

    if (typeof window !== 'undefined') {
        var files = document.querySelectorAll('input[name="answer"]');
        var correct = document.querySelectorAll('input[name="check"]:checked');
        // console.log([...correct].map(c => c.value))
    }

    const exam = [];
    for (var i in serviceList) {
        exam.push(serviceList[i].service)
    }

    const answering = [];
    for (var i in files) {
        answering.push(files[i].value)
    }

    const corrects = [];
    for (var i in correct) {
        corrects.push(correct[i].value)
    }

    console.log(corrects)

    const exams = [];
    var cnt = 0;
    var crt = 0;
    for (var i in exam) {
        exams.push({
            question: exam[i],
            a: answering[cnt],
            b: answering[cnt + 1],
            c: answering[cnt + 2],
            correctAnswer: corrects[crt]
        })
        cnt += 3
        crt += 1
    }

    function AddExam() {

        if (chosenCourse === null || chosenCourse === '') {
            toast("Сургалтаа сонгоно уу!")
        } else {
            if (chosenDetail === null || chosenDetail === '') {
                toast("Сургалтын сэдвээ сонгоно уу!")
            } else {

                var count = 0;
                for (var i in exams) {
                    if (exams[i].question === '' || exams[i].a === '' || exams[i].b === '') {

                    }
                }

                for (var i in exams) {
                    var result = axios.post('/api/insert/insertDetailExam', {
                        course_detail_id: chosenDetail.value,
                        question: exams[i].question,
                        a: exams[i].a,
                        b: exams[i].b,
                        c: exams[i].c,
                        correctAnswer: exams[i].correctAnswer,
                    })
                }

                result.then((res) => {
                    toast("Амжилттай!");
                    router.reload(router.asPath)
                })
            }
        }
    }

    return (
        <Layout>
            <Head>
                <title>Сургалт нэмэх</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <div className='flex flex-col sm:flex-row justify-start h-screen'>
                <SideNav />
                <ToastContainer
                    position='top-center'
                    autoClose={1500}
                />
                <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                    <h3 className='my-4'>Сургалтад асуулт бэлдэх</h3>
                    <div className='w-full'>
                        <div className='my-2 w-full'>
                            <Form.Label>Сургалт сонгох</Form.Label>
                            <Select
                                options={courses}
                                value={chosenCourse}
                                placeholder='Сургалт сонгох...'
                                onChange={(e) => selectCourse(e)}
                                isClearable
                                hasSelectAll={false}
                                className='mx-auto mb-2'
                            />
                        </div>
                        <div className='my-2 w-full'>
                            <Form.Label>Сургалтын сэдэв сонгох</Form.Label>
                            <Select
                                options={courseDetails}
                                value={chosenDetail}
                                placeholder='Сургалтын сэдэв сонгох...'
                                onChange={setChosenDetail}
                                isClearable
                                hasSelectAll={false}
                                className='mx-auto mb-2'
                            />
                        </div>
                    </div>

                    <form className='flex w-full my-5'>
                        <div className='form-field w-full'>

                            {serviceList.map((singleService, index) => (
                                <div key={index} className='services flex w-full'>
                                    <div className='first-division w-full my-2'>
                                        <div className='flex w-full flex-col xl:flex-row'>
                                            <div className='flex flex-col w-full'>
                                                <label className='mb-2'>Асуулт {index + 1}</label>
                                                <input name='service' type='text' id='service' className='bg-gray-200 rounded' required
                                                    value={singleService.service}
                                                    onChange={(e) => handleServiceChange(e, index)} />

                                                <div className='flex'>
                                                    <div className='w-full my-3'>
                                                        <label className='mb-2'>Сонголтууд</label>
                                                        <div className='flex w-full'>
                                                            <label className='flex'><input type="checkbox" name="check" value={'a'} />
                                                                <input name='answer' type='text' id='answer' className='bg-gray-200 rounded mx-3'
                                                                    required />
                                                            </label>

                                                            <label className='flex'><input type="checkbox" name="check" value={'b'} />
                                                                <input name='answer' type='text' id='answer' className='bg-gray-200 rounded mx-3'
                                                                    required />
                                                            </label>

                                                            <label className='flex'><input type="checkbox" name="check" value={'c'} />
                                                                <input name='answer' type='text' id='answer' className='bg-gray-200 rounded mx-3'
                                                                    required />
                                                            </label>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {serviceList.length - 1 === index && serviceList.length < 5 && (
                                            <button type='button' className='add-btn bg-gray-200 text-green-800 font-semibold text-base p-2 rounded my-2'
                                                onClick={handleServiceAdd}>
                                                <span>+ Асуулт нэмэх</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className='second-division ml-3 flex my-2'>
                                        {serviceList.length > 1 && (
                                            <div className='h-5 mt-5'>
                                                <button type='button' className='remove-btn text-black rounded text-center'
                                                    onClick={() => handleServicRemove(index)}>
                                                    <span className='text-red-600 text-xs'>Remove</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>

                    <div className='my-4'>
                        <p className='bg-[#841f47] text-white text-center py-2 px-5 rounded-lg m-auto cursor-pointer' onClick={AddExam}>Нэмэх</p>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const course = await prisma.course.findMany();
    const courseDetail = await prisma.courseDetail.findMany();

    return {
        props: {
            course: JSON.parse(JSON.stringify(course)),
            courseDetail: JSON.parse(JSON.stringify(courseDetail))
        }
    }
}


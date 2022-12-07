import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../AdminLayout/Layout';
import SideNav from '../SideNav';
import Head from 'next/head';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import admin from '../../../../styles/Admin.module.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';
import $ from 'jquery';

export default function AddUser(props) {
    const router = useRouter();
    const date = new Date();
    const [data, setData] = useState(props.db.products)
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [level, setLevel] = useState('');
    const [certificate, setCertificate] = useState('');
    const [description, setDescription] = useState('');
    const [course_ID, setCourse_ID] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [certificateValidDate, setCertificateValidDate] = useState(new Date(date.getFullYear() + 1, date.getMonth(), date.getDate()));
    const [endDate, setEndDate] = useState(new Date());
    const [video, setVideo] = useState("");
    const [size, setSize] = useState([]);

    const [durationn, setDurationn] = useState([])

    // selectuud
    const courseTypes = [];
    const durations = [];
    const levels = [];
    const certificates = [];

    for (let i = 0; i < data.length; i++) {
        durations.push({ value: data[i].id, label: data[i].id })
        levels.push({ value: data[i].rating, label: data[i].rating })
    }

    for (var i in props.type) {
        courseTypes.push({ value: props.type[i].type, label: props.type[i].type })
    }

    certificates.push({ value: 1, label: "Тийм" }, { value: 0, label: "Үгүй" })

    const handleType = (selectedOption) => {
        setType(selectedOption.value)
    }
    const handleDuration = (selectedOption) => {
        setDuration(selectedOption.value)
    }
    const handleLevel = (selectedOption) => {
        setLevel(selectedOption.value)
    }
    const handleCertificate = (selectedOption) => {
        setCertificate(selectedOption.value)
    }

    const videoRef = useRef(null);

    const asd = []
    const handleFileChange = async (event) => {
        const uploadfiles = [...event.target.files];
        setVideo(uploadfiles);

        for (var i in uploadfiles) {
            var video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                setDuration(video.duration)
                setSize(video.duration)
                const src = URL.createObjectURL(new Blob([uploadfiles[i]]))
                // setVideoSrc(src)
            }
            video.src = URL.createObjectURL(uploadfiles[i]);
        }

        for (let i = 0; i < uploadfiles.length; i++) {
            var reader = new FileReader();
            reader.readAsDataURL(uploadfiles[i]);
            reader.onload = function (e) {
                $("#previewVideo").append("<video src='" + e.target.result + "' controls>");
            }
        }
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
    

    const merge = [];
    if (typeof window !== 'undefined') {
        var Checked = document.querySelectorAll('input[type="checkbox"]:checked');
        var files = document.querySelectorAll('input[type="file"]');
        var timer = [...files].map(c => c.files[0])

        var array = [];
        
        var vid = document.querySelectorAll('video')
        for (let i = 0; i < vid.length; i++) {
            const duration = parseInt(vid[i].duration);
            array.push(duration)
        } 

        let count = 0;
        for (var i in serviceList) {
            merge.push({
                name: serviceList[i].service,
                video: [...files].map(c => c.value)[count],
                duration: array[count],
                isExam: [...Checked].map(c => c.value).includes(serviceList[i].service) ? true : false
            })
            count++
        }
    }
     
    console.log(merge);

    function AddCourse() {
        if (name === '' || type === '' || duration === '' || level === '' || certificate === '' || startDate === '' || endDate === '' || course_ID === '' || timer === '') {
            toast("Бүх талбарыг бөглөнө үү!!!")
        } else {
            let count = 0;
            for (var i in merge) {
                if (merge[i].name === '') {
                    count++
                }
            }

            if (count === 0) {
                axios.post('/api/insert/insertCourse', {
                    name: name,
                    type: type,
                    duration: duration,
                    courseLevel: level,
                    certificate: certificate,
                    certificateValidDate: certificateValidDate,
                    startDate: startDate,
                    endDate: endDate,
                    sysDate: new Date(),
                    description: description,
                    course_ID: course_ID
                }).then((res) => {
                    for (var i in merge) {
                        var result = axios.post('/api/insert/insertCourseDetail', {
                            courseID: res.data[0][''],
                            name: merge[i].name,
                            videoName: merge[i].video.slice(12, 500),
                            videoPath: '',
                            duration: merge[i].duration,
                            isExam: merge[i].isExam
                        }).catch(function (error) {
                            console.log(error)
                        })
                    }

                    result.then((res) => {

                        toast("Амжилттай!")

                        const formData = new FormData();
                        for (const file of [...files].map(c => c.files[0])) {
                            formData.append("inputFile", file);
                        }

                        fetch("/api/upload/uploadVideo", {
                            method: "POST",
                            body: formData,
                        })
                            .then((res) => console.log(res))
                            .catch((error) => ("Something went wrong!", error));

                        router.push({
                            pathname: '/components/Admin/Course/AdminCourses'
                        })
                    })
                })
                    .catch(function (error) {
                        console.log(error)
                    })
            } else {
                toast("Аль нэг сэдэв хоосон байна.")
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
                <pre id="infos"></pre>
                <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                    <h3 className='my-10'>Сургалт нэмэх</h3>
                    <ToastContainer
                        position='top-center'
                        autoClose='1300'
                    />
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Сургалтын нэр</Form.Label>
                            <Form.Control type="text" placeholder="Сургалтын нэр" required
                                onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Сургалтын төрөл</Form.Label>
                            <CreatableSelect
                                className=''
                                id='type'
                                onChange={handleType}
                                options={courseTypes}
                                placeholder='Сургалтын төрөл'
                            />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Сургалтын ID</Form.Label>
                            <Form.Control type="text" placeholder="Сургалтын ID" required
                                onChange={(e) => setCourse_ID(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Сургалтын үргэлжлэх хугацаа</Form.Label>
                            <CreatableSelect
                                className=''
                                id='duration'
                                onChange={handleDuration}
                                options={durations}
                                placeholder='Сургалтын үргэлжлэх хугацаа'
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Сургалтын түвшин (Level)</Form.Label>
                            <CreatableSelect
                                className=''
                                id='level'
                                onChange={handleLevel}
                                options={levels}
                                placeholder='Сургалтын төрөл'
                            />
                        </Form.Group>
                    </Form>
                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicPassword">
                            <Form.Label>Сертификаттай эсэх</Form.Label>
                            <CreatableSelect
                                className=''
                                id='level'
                                onChange={handleCertificate}
                                options={certificates}
                                placeholder='Сертификаттай эсэх'
                            />
                        </Form.Group>
                        {certificate == 1 ? <Form.Group className="mb-3 w-full sm:w-1/2 p-1" controlId="formBasicEmail">
                            <Form.Label>Сертификатын хүчинтэй хугацаа дуусах огноо</Form.Label>
                            <DatePicker
                                className={`border rounded-md text-sm ${admin.datepicker}`}
                                selected={certificateValidDate}
                                showMonthDropdown={true}
                                onChange={(date) => { setCertificateValidDate(date) }}
                                placeholder=""
                            />
                        </Form.Group> : ''}
                    </Form>

                    {/* <div className='flex w-full my-2'>
                        <div className='w-full'>
                            <div className='w-full flex flex-col'>
                                <Form.Label>Бичлэг оруулах</Form.Label>
                                <input type="file" className="border rounded-md" multiple ref={videoRef}
                                    onChange={(e) => handleFileChange(e)} />
                            </div> */}

                    {/* <div className="input-group input-group-sm mb-3">
                                <input type="file" className="form-control" name='picture' onChange={(e) => handleFileChange(e)} multiple />
                                <button className={`btn btn-primary btn-sm px-3`} onClick={handleSubmit}>
                                    <i className="fa-solid fa-upload"></i> :
                                </button>
                            </div> */}
                    {/* </div>

                    </div> */}

                    <form className='flex w-full' onSubmit={(e) => test(e)}>
                        <div className='form-field w-full'>

                            {serviceList.map((singleService, index) => (
                                <div key={index} className='services flex w-full'>
                                    <div className='first-division w-full my-2'>
                                        <div className='flex w-full flex-col xl:flex-row'>
                                            <div className='flex flex-col w-full xl:w-2/3'>
                                                <label className='mb-2'>Сэдэв {index + 1}</label>
                                                <input name='service' type='text' id='service' className='bg-gray-200 rounded' required
                                                    value={singleService.service}
                                                    onChange={(e) => handleServiceChange(e, index)} />
                                            </div>
                                            <div className='w-full xl:w-1/3 flex justify-between'>
                                                <div className='w-full flex flex-col xl:mx-2'>
                                                    <Form.Label className='text-xs'>Бичлэг оруулах</Form.Label>
                                                    <input type="file" name='file' id='file-input' accept='video/*' className="files border rounded-md" ref={videoRef}
                                                        onChange={(e) => handleFileChange(e)} />
                                                </div>
                                                <div className='flex flex-col mx-2 text-center justify-end xl:justify-center items-center'>
                                                    <Form.Label className='text-xs font-semibold'>Шалгалттай эсэх</Form.Label>
                                                    <input type="checkbox" id='check' name='check' className="checkbox border rounded-md" value={singleService.service} />
                                                </div>
                                            </div>
                                        </div>

                                        {serviceList.length - 1 === index && serviceList.length < 20 && (
                                            <button type='button' className='add-btn bg-gray-200 text-green-800 font-semibold text-base p-2 rounded my-2'
                                                onClick={handleServiceAdd}>
                                                <span>+ Сэдэв нэмэх</span>
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

                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full p-1" controlId="formBasicEmail">
                            <Form.Label>Тайлбар</Form.Label>
                            <Form.Control type="text" placeholder="Тайлбар..." required
                                onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                    </Form>

                    <Form className='flex flex-col sm:flex-row w-full'>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1 flex flex-col mx-auto" controlId="formBasicPassword">
                            <Form.Label>Эхлэх хугацаа</Form.Label>
                            <DatePicker
                                className={`border rounded-md text-sm ${admin.datepicker}`}
                                selected={startDate}
                                showMonthDropdown={true}
                                onChange={(date) => { setStartDate(date) }}
                                placeholder=""
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 w-full sm:w-1/2 p-1 flex flex-col mx-auto" controlId="formBasicPassword">
                            <Form.Label>Дуусах хугацаа</Form.Label>
                            <DatePicker
                                className={`border rounded-md text-sm ${admin.datepicker}`}
                                selected={endDate}
                                showMonthDropdown={true}
                                onChange={(date) => { setEndDate(date) }}
                                placeholder=""
                            />
                        </Form.Group>
                    </Form>
                    <div className='my-4'>
                        <p className='bg-[#2e3977] text-white text-center py-2 px-5 rounded-lg m-auto cursor-pointer' onClick={AddCourse}>Нэмэх</p>
                    </div>
                </div>
            </div>
            <div id='previewVideo' className='d-none'></div>
        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const res = await fetch('https://dummyjson.com/products')
    const db = await res.json()

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


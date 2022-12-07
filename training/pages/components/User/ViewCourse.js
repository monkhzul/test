import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import coursecss from '../../../styles/Course.module.css';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';
import { Modal, Button } from 'rsuite';

const prisma = new PrismaClient();

export default function AddUser(props) {
    const [data, setData] = useState(props.db)
    const [durationn, setDurationn] = useState()
    const router = useRouter();

    const [id, setId] = useState();
    useEffect(() => {
        setId(sessionStorage.getItem('course_id'))
    }, [])

    const course = [];

    for (var i in data) {
        if (data[i].courseID === Number(id)) {
            course.push({
                id: data[i].id,
                name: data[i].name,
                videoName: data[i].videoName,
                duration: data[i].duration,
                isExam: data[i].isExam
            })
        }
    }

    const [videoName, setVideo] = useState(course.length == 0 ? '' : course[0].videoName);
    const [topicName, setTopicName] = useState(course.length != 0 ? course[0].name : '');

    const Course = [];

    for (var i in props.course) {
        if (props.course[i].id == id) {
            Course.push({
                name: props.course[i].name,
                description: props.course[i].description,
                certificate: props.course[i].certificate,
                certificateValidDate: props.course[i].certificateValidDate,
                courseLevel: props.course[i].courseLevel,
                endDate: props.course[i].endDate,
                startDate: props.course[i].startDate,
                type: props.course[i].type
            })
        }
    }

    if (typeof window !== 'undefined') {
        var video = document.getElementById("video");

        var timeStarted = -1;
        var timePlayed = 0;
        var duration = 0;
    }
    // remember time user started the video
    function videoStartedPlaying() {
        timeStarted = new Date().getTime() / 1000;
    }

    function videoStoppedPlaying(event) {
        // Start time less then zero means stop event was fired vidout start event
        if (timeStarted > 0) {
            var playedFor = new Date().getTime() / 1000 - timeStarted;
            timeStarted = -1;
            // add the new ammount of seconds played
            timePlayed += playedFor;
        }
        document.getElementById("played").innerHTML = Math.round(timePlayed) + "";

        // Count as complete only if end of video was reached
        if (timePlayed >= duration && event.type == "ended") {
            document.getElementById("status").className = "complete";
        }
    }

    video?.addEventListener("play", videoStartedPlaying);
    video?.addEventListener("playing", videoStartedPlaying);

    video?.addEventListener("ended", videoStoppedPlaying);
    video?.addEventListener("pause", videoStoppedPlaying);


    function playVideo(name, topicName, duration) {
        if (videoName !== name) {
            setVideo(name)
            setTopicName(topicName)
            setDurationn(duration)
            timePlayed = 0
            document.getElementById("played").innerHTML = Math.round(timePlayed) + "";
        }
    }

    const [detail_exam, setDetail_Exam] = useState(props.detail_exam);
    const [view_detail, setView_Detail] = useState(props.view_detail);
    const [detExam, setDetExam] = useState([]);
    
    function exam(id) {
        console.log(id);
        const result = detail_exam.filter(itemInArray => itemInArray.course_detail_id == id);
        setDetExam(result)
        setOpen(true)
    }

    const [open, setOpen] = useState(false);

    function Check() {
        let count = 0;
        var correct = document.querySelectorAll('input[name="check"]:checked');
        // console.log([...correct].map(c => c.value))

        for (var i in detExam) {
            if (detExam[i].correctAnswer == [...correct].map(c => c.value)[i]) {
                count++
            }
        }

        if (count == detExam.length) {
            toast('Амжилттай!  100%')
            setOpen(false)

        } else {
            toast("Хичээлээ дахин үзнэ үү!")
            setOpen(false)
        }
    }

    return (
        <Layout>
            <Head>
                <title>Сургалт</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <ToastContainer position='top-center' autoClose={1500} />
            <div className='flex flex-col sm:flex-row justify-start h-auto'>
                <div className='w-full flex flex-col lg:flex-row bg-slate-50 p-5'>
                    <div className='w-full lg:w-2/3'>
                        <div className=''>
                            <h4 className='text-center'>{topicName}</h4>
                            <div className={`p-2 ${coursecss.video}`}>
                                {/* <video className='w-full' controls="true" poster="" id="video">
                                        <source type="video/mp4" src={`/uploads/${videoName}`}/>
                                    </video> */}

                                <video src={`/uploads/${videoName}`} className='w-full' onContextMenu={false} 
                                    controls={true} role='noslider' controlsList='nodownload' id="video" 
                                />
                                <div className='flex justify-between my-1'>
                                    <div id="status" className="incomplete">
                                        <span className='text-gray-400'>Play status: </span>
                                        <span className="status complete">COMPLETE</span>
                                        <span className="status incomplete">INCOMPLETE</span>
                                    </div>
                                    <div className='text-gray-400'>
                                        <span id="played">0</span> seconds
                                    </div>
                                </div>

                            </div>
                            <div className='d-none'>
                                {course.map((data) =>
                                    <video id='video_player' src={`/uploads/${data.videoName}`} controls={true} />
                                )}
                            </div>

                            <div className='border flex flex-col md:flex-row justify-around rounded-lg shadow-xl my-5 ml-2 2xl:mr-8'>
                                <div className='m-3'>
                                    {Course.map((data) =>
                                        <div className='p-2 w-full'>
                                            <h4 className='mb-3'>{data.name}</h4>
                                            <p>{data.description}</p>
                                            <h5 className='my-3'>Сургалтын төрөл</h5>
                                            <p>{data.type}</p>
                                            <h5 className='my-3'>Сургалтын хугацаа</h5>
                                            <p>{data.startDate.slice(0, 10)} - {data.endDate.slice(0, 10)}</p>
                                            <h5 className='my-3'>Сертификаттай эсэх</h5>
                                            <p>{data.certificate === true ? `Сертификаттай` : `Сертификатгүй`}</p>
                                        </div>
                                    )}
                                </div>
                                <div className={`flex flex-col justify-around m-5 shadow-lg bg-[#ecf3f3] relative`}>
                                    <div className={`${coursecss.info} absolute`}></div>
                                    <div className='p-3 w-full flex text-[#268a8d]'>
                                        <div className='w-1/2 text-center'>
                                            Тухайн сургалтыг үзсэн хувь:
                                        </div>
                                        <div className='w-1/2 text-center flex justify-center items-center font-semibold'>
                                            0
                                        </div>
                                    </div>
                                    <div className='p-3 w-full flex text-[#268a8d]'>
                                        <div className='w-1/2 text-center'>
                                            Тухайн сургалтын үзэж дуусгасан сэдвийн тоо:
                                        </div>
                                        <div className='w-1/2 text-center flex justify-center items-center font-semibold'>
                                            0
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='border-b-2'>
                                <div className='my-5 mx-auto text-center back bg-[#5f9ea0] rounded w-min p-2 px-3'>
                                    <Link href={'/components/User/Courses'} className="mt-5">
                                        Буцах
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full lg:w-1/3 p-2 rounded-md'>
                        <h4 className='flex justify-center mb-4'>Сэдвүүд</h4>
                        {course.map((data, i) =>
                                <div className={`${coursecss.topic} my-1 border-b-2 bg-[#5f9ea0] text-gray-50 p-2 rounded-lg cursor-pointer`} key={i}>
                                    <div className='justify-between items-center' onClick={() => playVideo(data.videoName, data.name, data.duration)}>
                                        <div className='flex my-2 justify-start mx-2'>
                                            <div className='text-xl mx-3 overflow-auto'>
                                                {i + 1}. {data.name}
                                            </div>
                                        </div>
                                        <div className='flex justify-between mx-3'>
                                            <div className='text-sm mx-3 text-gray-200'>
                                                Үргэлжлэх хугацаа: &nbsp;
                                                {data.duration / 60 < 10 ? "0" + parseInt(data.duration / 60) : parseInt(data.duration / 60)}:{data.duration % 60 < 10 ? "0" + parseInt(data.duration % 60) : parseInt(data.duration % 60)} 
                                            </div>
                                            <div className='flex items-center'>
                                                <Image src='/images/playi.png' className="h-5 flex items-center" width={30} height={25} objectFit='' />
                                            </div>
                                        </div>
                                        {data.isExam == true ?
                                            <div className='text-center bg-[#ecf3f3] w-max py-0.5 px-2 rounded-md mx-auto mt-2'
                                                onClick={() => exam(data.id)}>
                                                <p className='text-[#268a8d]'>Шалгалт өгөх</p>
                                            </div> : ''}
                                    </div>
                                </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal backdrop="static" role="alertdialog" open={open} onClose={() => setOpen(false)} size="md" >
                <Modal.Body>
                    <h4 className='text-center mb-3'>{topicName}</h4>
                    {detExam.map((data, i) =>
                        <div className='my-3 border-b-2'>
                            <div className='flex'>
                                <h5>{i + 1}.</h5>
                                <h5 className='mx-3 text-xl'>{data.question}</h5>
                            </div>
                            <div className='flex flex-col lg:flex-row my-2 ml-10 text-base'>
                                <div className='w-1/3'>
                                    <input type='checkbox' value={'a'} name='check' />
                                    <label className='mx-2 font-semibold'>{data.a}</label>
                                </div>
                                <div className='w-1/3'>
                                    <input type='checkbox' value={'b'} name='check' />
                                    <label className='mx-2 font-semibold'>{data.b}</label>
                                </div>
                                <div className='w-1/3'>
                                    <input type='checkbox' value={'c'} name='check' />
                                    <label className='mx-2 font-semibold'>{data.c}</label>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={Check} appearance="primary" className='text-white'>
                        Илгээх
                    </Button>
                    <Button onClick={() => setOpen(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    )
}

export const getServerSideProps = async (context) => {

    const res = await prisma.courseDetail.findMany();
    const db = JSON.parse(JSON.stringify(res))

    const res1 = await prisma.course.findMany();
    const course = JSON.parse(JSON.stringify(res1))

    const detail_exam = await prisma.course_Detail_Exam.findMany();
    
    const view_detail = await prisma.user_Viewed_CourseDetail.findMany();

    return {
        props: {
            db: db,
            course: course,
            detail_exam: JSON.parse(JSON.stringify(detail_exam)),
            view_detail: JSON.parse(JSON.stringify(view_detail))
        }
    }
}

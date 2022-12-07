import React, { useState, useEffect } from 'react'
import Layout from '../../AdminLayout/Layout'
import SideNav from '../SideNav'
import Head from 'next/head'
import Form from 'react-bootstrap/Form';
import DateRangePicker from "rsuite/DateRangePicker";
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'
import { MultiSelect } from 'react-multi-select-component';
import { PrismaClient } from '@prisma/client';
import { Table } from 'rsuite';
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import moment from 'moment'

export default function AddUser(props) {
  const router = useRouter();
  const [users, setUsers] = useState(props.users);
  const [position, setPosition] = useState(props.position);
  const [department, setDepartment] = useState(props.department);
  const [coursed, setCoursed] = useState(props.course);
  const [level, setLevel] = useState([]);
  const [workplace, setWorkPlace] = useState([]);
  const [course, setCourse] = useState([]);
  const [erp, setErp] = useState([]);
  const [dep, setDep] = useState([]);
  const [chosenDate, setChosenDate] = useState([]);
  const { Column, HeaderCell, Cell } = Table;

  const levels = []; const positions = []; const erps = []; const courses = []; const departments = [];

  for (var i = 1; i < 12; i++) {
    levels.push({
      value: i,
      label: i
    })
  }

  for (var i in position) {
    positions.push({
      value: position[i].position,
      label: position[i].position,
    })
  }

  for (var i in department) {
    departments.push({
      value: department[i].department,
      label: department[i].department,
    })
  }

  for (var i in users) {
    erps.push({
      value: (users[i].erp_code).toString(),
      label: (users[i].erp_code).toString(),
    })
  }

  for (var i in coursed) {
    courses.push({
      value: coursed[i].name,
      label: `${coursed[i].name} - ${coursed[i].id}`,
    })
  }

  const arr = []; const pos = []; const ERP = []; const Course = []; const DEP = [];

  for (var i in level) {
    arr.push(level[i].value)
  }
  for (var i in workplace) {
    pos.push(workplace[i].value)
  }
  for (var i in erp) {
    ERP.push(Number(erp[i].value))
  }
  for (var i in course) {
    Course.push(course[i].value)
  }
  for (var i in dep) {
    DEP.push(dep[i].value)
  }

  const chosenUsers = [];
  const chosenCourses = [];

  for (var i in users) {
    if (arr.includes(users[i].rank) || pos.includes(users[i].position) ||
      ERP.includes(users[i].erp_code) || DEP.includes(users[i].department)) {
      chosenUsers.push({
        id: users[i].id,
        companyName: users[i].companyName,
        department: users[i].department,
        lastName: users[i].lastName,
        firstName: users[i].firstName,
        birth_day: (users[i].birth_day).slice(0, 10),
        erp_code: users[i].erp_code,
        position: users[i].position,
        rank: users[i].rank,
        user_type: users[i].user_id === 1 ? 'Админ' : users[i].user_id === 2 ? 'Багш' : users[i].user_id === 4 ? 'Албаны дарга' : 'Хэрэглэгч',
        date_of_employment: users[i].date_of_employment.slice(0, 10)
      })
    }
  }

  for (var i in coursed) {
    if (Course.includes(coursed[i].name)) {
      chosenCourses.push({
        id: coursed[i].id,
        course_ID: coursed[i].course_ID,
        name: coursed[i].name,
        type: coursed[i].type,
        duration: coursed[i].duration,
        courseLevel: coursed[i].courseLevel,
        startDate: coursed[i].startDate.slice(0, 10),
        endDate: coursed[i].endDate.slice(0, 10),
        description: coursed[i].description,
        certificate: coursed[i].certificate === true ? "Байгаа" : "Байхгүй",
      })
    }
  }

  // if (chosenDate === undefined || chosenDate === null) {

  // } else {
  //   var result = users.filter((d) => {
  //     var date = new Date(d.date_of_employment);
  //     const parseDate = date.toISOString().slice(0, 10)
  //     return (
  //       parseDate >= moment(chosenDate[0]).format('YYYY-MM-DD')
  //       && parseDate <= moment(chosenDate[1]).format('YYYY-MM-DD')
  //     );
  //   })
  // }

  var result = []
  if (chosenDate === undefined || chosenDate === null) { } else {
    for (var i in users) {
      if ((users[i].date_of_employment.slice(0, 10)) >= moment(chosenDate[0]).format('YYYY-MM-DD') &&
        (users[i].date_of_employment.slice(0, 10)) <= moment(chosenDate[1]).format('YYYY-MM-DD')) {
        result.push({
          id: users[i].id,
          companyName: users[i].companyName,
          department: users[i].department,
          lastName: users[i].lastName,
          firstName: users[i].firstName,
          birth_day: (users[i].birth_day).slice(0, 10),
          erp_code: users[i].erp_code,
          position: users[i].position,
          rank: users[i].rank,
          user_type: users[i].user_id === 1 ? 'Админ' : users[i].user_id === 2 ? 'Багш' : users[i].user_id === 4 ? 'Албаны дарга' : 'Хэрэглэгч',
          date_of_employment: users[i].date_of_employment.slice(0, 10)
        })
      }
    }
  }

  var resultUser = chosenUsers === '' ? result : chosenUsers.concat(result);

  // const ccid = [];
  // for (var i in chosenCourses) {
  //   ccid.push({
  //     course_id: chosenCourses[i].id,
  //     courseName_ID: chosenCourses[i].course_ID,
  //     course_name: chosenCourses[i].name,
  //     startDate: chosenCourses[i].startDate,
  //     endDate: chosenCourses[i].endDate
  //   })
  // }

  function AddCourseLevel() {

    if (resultUser.length !== 0) {
      if (chosenCourses.length !== 0) {
        for (let j = 0; j < chosenCourses.length; j++) {
          for (var i in resultUser) {
            var result = axios.post('/api/insert/insertAccessUser', {
              last_name: resultUser[i].lastName,
              user_name: resultUser[i].firstName,
              erp_code: resultUser[i].erp_code,
              course_id: chosenCourses[j].id,
              courseName_ID: chosenCourses[j].course_ID,
              course_name: chosenCourses[j].name,
              date_of_completion: "",
              assessment: "",
              exam_score: "",
              isCertificate: "",
              certificateValidDate: "",
              viewed_detail: 0,
              isComplete: false,
              startDate: chosenCourses[j].startDate,
              endDate: chosenCourses[j].endDate
            })
          }
        }
        result.then((res) => {
          console.log(res)
          toast("Амжилттай!");
          router.reload(router.asPath)
        })
      } else {
        toast("Сургалтаа сонгоно уу!")
      }
    } else {
      toast("Хэрэглэгчээ сонгоно уу!")
    }

  }

  return (
    <Layout>
      <Head>
        <title>Хэрэглэгчийн эрх нэмэх</title>
        <link rel="icon" href="/images/getsitelogo.png" />
      </Head>
      <div className='flex flex-col sm:flex-row justify-start h-screen p-3'>
        <SideNav />
        <ToastContainer
          position='top-center'
          autoClose={1500}
        />
        <div className='w-full px-5 mb-10 md:px-28 flex flex-col items-center'>
          <h4 className='my-3'>Хэрэглэгчид сургалтын эрх нэмэх</h4>
          <div className='w-full my-3'>
            <Form.Group className="" controlId="formBasicPassword">
              <div className='my-2'>
                <Form.Label>Зэрэглэлээр</Form.Label>
                <MultiSelect
                  options={levels}
                  value={level}
                  labelledBy={"Choose a category..."}
                  onChange={setLevel}
                  hasSelectAll={false}
                  // shouldToggleOnHover
                  className='mx-auto mb-2'
                />
              </div>

              <div className=' my-2'>
                <Form.Label>Ажлын байраар</Form.Label>
                <MultiSelect
                  options={positions}
                  value={workplace}
                  labelledBy={"Choose a category..."}
                  onChange={setWorkPlace}
                  hasSelectAll={true}
                  className='mx-auto mb-2'
                />
              </div>

              <div className=' my-2'>
                <Form.Label>Алба хэлтэсээр</Form.Label>
                <MultiSelect
                  options={departments}
                  value={dep}
                  // labelledBy={"Choose a department..."}
                  onChange={setDep}
                  hasSelectAll={true}
                  className='mx-auto mb-2'
                  labelledBy='kjhghjk'
                />
              </div>

              <div className='my-2'>
                <Form.Label>Ажилд орсон хугацаагаар</Form.Label>
                <div className="flex">
                  <DateRangePicker
                    size="lg"
                    value={chosenDate}
                    onChange={setChosenDate}
                    className='w-full'
                    ranges={[
                      {
                        label: 'Today',
                        value: [new Date(), new Date()],
                        placement: 'left'
                      },
                      {
                        label: 'Yesterday',
                        value: [addDays(new Date(), -1), addDays(new Date(), -1)],
                        placement: 'left'
                      },
                      {
                        label: 'This week',
                        value: [startOfWeek(new Date()), endOfWeek(new Date())],
                        placement: 'left'
                      },
                      {
                        label: 'Last week',
                        closeOverlay: false,
                        value: value => {
                          const [start = new Date()] = value || [];
                          return [
                            addDays(startOfWeek(start, { weekStartsOn: 1 }), -7),
                            addDays(endOfWeek(start, { weekStartsOn: 1 }), -7)
                          ];
                        },
                        placement: 'left'
                      },
                      {
                        label: 'Last 7 days',
                        value: [subDays(new Date(), 6), new Date()],
                        placement: 'left'
                      },
                      {
                        label: 'Last 30 days',
                        value: [subDays(new Date(), 29), new Date()],
                        placement: 'left'
                      },
                      {
                        label: 'This month',
                        value: [startOfMonth(new Date()), new Date()],
                        placement: 'left'
                      },
                      {
                        label: 'Last month',
                        value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
                        placement: 'left'
                      },
                      {
                        label: 'This year',
                        value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
                        placement: 'left'
                      },
                      {
                        label: 'Last year',
                        value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
                        placement: 'left'
                      }
                    ]}
                  />
                </div>
              </div>

              <div className='mt-5'>
                <Form.Label>ERP кодоор</Form.Label>
                <MultiSelect
                  options={erps}
                  value={erp}
                  labelledBy={"Choose a category..."}
                  onChange={setErp}
                  hasSelectAll={true}
                  className='mx-auto w-full mb-2'
                />
              </div>
            </Form.Group>

            <div className='mt-5'>
              <h4>Сонгогдсон хэрэглэгчид</h4>
              <div className='w-full my-3 shadow-2xl'>
                <Table
                  height={400}
                  data={resultUser}
                  onRowClick={rowData => {
                    console.log(rowData);
                  }}
                // locale={{emptyMessage: "No Data"}}
                >
                  {/* <Column align="center" fixed>
                    <HeaderCell>№</HeaderCell>
                    <Cell dataKey="id" />
                  </Column> */}

                  <Column align="center" fixed>
                    <HeaderCell>ERP_Code</HeaderCell>
                    <Cell dataKey="erp_code" />
                  </Column>

                  {/* <Column >
                    <HeaderCell>Компани</HeaderCell>
                    <Cell dataKey="companyName" />
                  </Column> */}

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

                  <Column width={150}>
                    <HeaderCell>Төрсөн огноо</HeaderCell>
                    <Cell dataKey="birth_day" />
                  </Column>

                  <Column width={200}>
                    <HeaderCell>Албан тушаал</HeaderCell>
                    <Cell dataKey="position" />
                  </Column>

                  <Column >
                    <HeaderCell>Зэрэглэл</HeaderCell>
                    <Cell dataKey="rank" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Ажилд орсон огноо</HeaderCell>
                    <Cell dataKey={`date_of_employment`} />
                  </Column>

                  <Column width={200}>
                    <HeaderCell>Хэрэглэгчийн төрөл</HeaderCell>
                    <Cell dataKey="user_type" />
                  </Column>
                </Table>
              </div>
              <p className='my-4'>Нийт: {resultUser.length} хэрэглэгч</p>
            </div>
          </div>

          <div className='w-full flex flex-col justify-center items-center my-5'>
            <h3>Эрх нээх сургалт</h3>
            <div className='my-2 w-full'>
              <Form.Label>Сургалт сонгох</Form.Label>
              <MultiSelect
                options={courses}
                value={course}
                labelledBy={"Choose a course..."}
                onChange={setCourse}
                hasSelectAll={true}
                className='mx-auto mb-2'
              />
            </div>

            <div className='mt-5 w-full'>
              <h4>Сонгогдсон сургалтууд</h4>
              <div className='w-full my-3 shadow-2xl'>
                <Table
                  height={400}
                  data={chosenCourses}
                  onRowClick={rowData => {
                    console.log(rowData);
                  }}
                >
                  {/* <Column align="center" fixed>
                    <HeaderCell>№</HeaderCell>
                    <Cell dataKey="id" />
                  </Column> */}

                  <Column width={250} align="center" fixed>
                    <HeaderCell>Сургалтын нэр</HeaderCell>
                    <Cell dataKey="name" />
                  </Column>

                  <Column width={250}>
                    <HeaderCell>Сургалтын төрөл</HeaderCell>
                    <Cell dataKey="type" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Эхлэх өдөр</HeaderCell>
                    <Cell dataKey="startDate" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Дуусах өдөр</HeaderCell>
                    <Cell dataKey="endDate" />
                  </Column>

                  <Column width={100}>
                    <HeaderCell>Хугацаа</HeaderCell>
                    <Cell dataKey="duration" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Сертификаттай эсэх</HeaderCell>
                    <Cell dataKey="certificate" />
                  </Column>
                </Table>
              </div>
              <p className='my-4'>Нийт: {chosenCourses.length} сургалт</p>
            </div>
          </div>

          <div className='my-4'>
            <p className='bg-[#841f47] text-white text-center py-2 px-5 rounded-lg mb-28 cursor-pointer' onClick={AddCourseLevel}>Нэмэх</p>
          </div>

        </div>
      </div>
    </Layout>
  )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

  const users = await prisma.user.findMany();

  const position = await prisma.user.findMany({
    distinct: ['position']
  });

  const department = await prisma.user.findMany({
    distinct: ['department']
  });

  const course = await prisma.course.findMany();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
      position: JSON.parse(JSON.stringify(position)),
      department: JSON.parse(JSON.stringify(department)),
      course: JSON.parse(JSON.stringify(course))
    }
  }
}

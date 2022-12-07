import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';

export default function Header() {

    const [username, setUsername] = useState('');
    const [erp, setErp] = useState('');

    useEffect(() => {
        setUsername(sessionStorage.getItem('user'))
        setErp(sessionStorage.getItem('userId'))
    }, [])
    
  return (
    <header className="">
                <div className='flex justify-between flex-col-reverse sm:flex-row my-2'>
                    <div className='flex w-full px-3 sm:px-5 justify-between sm:justify-start'>
                    <div className='flex h-8 my-auto'>
                    <Image src={'/images/cola.png'} width={200} height={10} className="" />
                    </div>
                    <Form className="flex mx-3 sm:mx-5 my-2">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <div className="border-2 px-3 text-center flex items-center rounded-md hover:bg-[#2e3977] hover:text-gray-100">Search</div>
                    </Form>
                    </div>
                    <Dropdown className='my-2 flex justify-end'>
                        <Dropdown.Toggle id="dropdown-button-dark-example1" className='mx-3'>
                            {username}
                        </Dropdown.Toggle>

                        <Dropdown.Menu variant="">
                            {/* <Dropdown.Item href="/components/Admin/Admin">Админ хуудас</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                            {/* <Dropdown.Divider /> */}
                                <Dropdown.Item href="/">Sign Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <div className='user w-full'>
                    
                    <Navbar bg="dark" expand="md">
                        <Container fluid>
                            <Navbar.Brand href="/components/Admin/Admin" className='mx-5 font-bold'>М-Си-Эс Кока Кола</Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbarScroll" />
                            <Navbar.Collapse id="navbarScroll">
                                <Nav
                                    className="me-auto my-2 my-lg-0 w-full flex justify-center text-md flex-wrap navMenu"
                                    navbarScroll
                                >
                                    <NavDropdown title="Бидний тухай" id="navbarScrollingDropdown" menuVariant="dark">
                                        <NavDropdown.Item href="/components/About/Principles">Бидний тухай</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action5">
                                            Түгээмэл асуулт, хариулт
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title="Сургалтын мэдээлэл" id="navbarScrollingDropdown" menuVariant="dark">
                                        <NavDropdown.Item href="/components/Admin/Course/AdminCourses">Сургалтууд</NavDropdown.Item>
                                        <NavDropdown.Item href="/components/Admin/Course/CourseCalendar">
                                            Сургалтын хуваарь
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        {/* <NavDropdown.Item href="#action5">
                                            Эх сурвалжууд
                                        </NavDropdown.Item> */}
                                    </NavDropdown>
                                    <Nav.Link href="#action1">Хөтөлбөрүүд</Nav.Link>
                                    <NavDropdown title="Миний сургалтууд" id="navbarScrollingDropdown" menuVariant="dark">
                                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action4">
                                            Another action
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action5">
                                            Something else here
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link href="#">
                                        Багш нар
                                    </Nav.Link>
                                </Nav>

                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
            </header>
  )
}

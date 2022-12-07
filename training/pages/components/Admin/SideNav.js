import React, { useState } from 'react'
import { Sidenav, Nav, Toggle } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import Link from 'next/link';

export default function SideNav() {
    const [activeKey, setActiveKey] = useState('1');
    const [expanded, setExpanded] = useState(true);

    const NavLink = React.forwardRef((props, ref) => {
        const { href, as, ...rest } = props;
        return (
            <Link href={href} as={as}>
                <a ref={ref} {...rest} />
            </Link>
        );
    });

    return (
        <Sidenav expanded={expanded} defaultOpenKeys={['3', '4']} className={``}>
            <Sidenav.Header>
                <Sidenav.Toggle expanded={expanded} onToggle={expanded => setExpanded(expanded)} />
            </Sidenav.Header>
            <Sidenav.Body>
                <Nav activeKey={activeKey} onSelect={setActiveKey}>
                    <Nav.Item eventKey="1" icon={<DashboardIcon />}>
                        Dashboard
                    </Nav.Item>
                    <Nav.Item eventKey="2" icon={<MagicIcon />}>
                        User Group
                    </Nav.Item>
                    <Nav.Menu placement="rightStart" eventKey="3" title="Хэрэглэгч" icon={<GroupIcon />}>
                        <Nav.Item eventKey="3-1" as={NavLink} href='/components/Admin/User/AddUser'>Хэрэглэгч нэмэх</Nav.Item>
                        <Nav.Item eventKey="3-2" as={NavLink} href='/components/Admin/User/AddUserLevel'>Хэрэглэгчийн эрх нэмэх</Nav.Item>
                        <Nav.Item eventKey="3-3" href='/components/Admin/User/ReqConfirm' as={NavLink}>Хэрэглэгчийн илгээсэн хүсэлт</Nav.Item>
                    </Nav.Menu>
                    <Nav.Menu 
                     placement="rightStart"
                     eventKey="4"
                     title="Сургалт"
                     icon={<MagicIcon />}>
                        <Nav.Item eventKey="4-1" as={NavLink} href='/components/Admin/Course/AddCourse'>Сургалт нэмэх</Nav.Item>
                        <Nav.Item eventKey="4-2" href='/components/Admin/Course/DetailExam' as={NavLink}>Сургалтад асуулт бэлдэх</Nav.Item>
                    </Nav.Menu>
                    <Nav.Menu
                        placement="rightStart"
                        eventKey="5"
                        title="Тайлан"
                        icon={<GearCircleIcon />}>
                        <Nav.Item eventKey="5-1" as={NavLink} href='/components/Admin/Report/Total'>Нийт хэрэглэгчидийн үзсэн сургалт</Nav.Item>
                        <Nav.Item eventKey="5-2">Channels</Nav.Item>
                        <Nav.Item eventKey="5-3">Versions</Nav.Item>
                    </Nav.Menu>
                </Nav>
            </Sidenav.Body>
        </Sidenav>
    )
}

import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';

export default function BottomBar() {
    const [userName, setUserName] = useState<string>('NotLoggedIn');
    return (
        <Menu>
            <Container>
                <Menu.Item as={NavLink} to='/settingsPage'>
                    <Button content={ userName } />
                </Menu.Item>
                <Menu.Item as={NavLink} to='/settingsPage'>
                    <Button content="email kontaktowy" />
                </Menu.Item>        
            </Container>
        </Menu>
    )
}

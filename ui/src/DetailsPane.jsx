import React, { useState, useEffect, useRef } from 'react';
import {
    Avatar,
    Container,
    Text
} from '@chakra-ui/react'

export default function DetailsPane({ entity }) {
    let [user, setUser] = useState({});
    let [loading, setLoading] = useState(false);
    useEffect(fetchData, [entity]);

    function fetchData() {
        if (loading) {
            return
        }
        setLoading(true)
        const url = `/user/${entity.login}`;
        fetch(url)
            .then((response) => response.json())
            .then((d) => {
                setUser(d)
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }


    if (user && user.name) {
        return (
            <Container size="lg">
                <Avatar name={user.name} src={user.avatar_url} />
                <Text>{user.name}</Text>
                <Text>{user.location}</Text>
            </Container>
        );
    }
}
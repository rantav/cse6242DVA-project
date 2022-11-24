import React, { useState, useEffect, useRef } from 'react';
import {
    Avatar,
    Text,
    Stack,
    Heading,
    Divider
} from '@chakra-ui/react'
import { Card, CardBody, CardFooter } from '@chakra-ui/card'

export default function DetailsPane({ entity }) {
    let [user, setUser] = useState({});
    let [loading, setLoading] = useState(false);
    useEffect(fetchData, [entity]);

    // TODO: Support for repos
    // TODO: add more data
    function fetchData() {
        setUser(null);
        if (loading) {
            return
        }
        if (entity.type == 'actor') {
            setLoading(true);
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
    }


    if (user && user.name) {
        return (
            <Card maxW='sm'>
                <CardBody>
                    <Avatar name={user.name} src={user.avatar_url} />
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{user.name}</Heading>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Text>
                        {user.location}
                    </Text>
                </CardFooter>
            </Card>

        );
    }
}
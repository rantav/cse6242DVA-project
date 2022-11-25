import React, { useState, useEffect, useRef } from 'react';
import {
    Avatar,
    Text,
    Stack,
    Heading,
    Divider,
    Badge
} from '@chakra-ui/react'
import { Card, CardBody, CardFooter } from '@chakra-ui/card'

export default function DetailsPane({ entity }) {
    let [user, setUser] = useState(null);
    let [repo, setRepo] = useState(null);
    let [loading, setLoading] = useState(false);
    useEffect(fetchData, [entity]);

    function fetchData() {
        setUser(null);
        if (loading) {
            return
        }
        if (entity.type == 'actor') {
            setLoading(true);
            setRepo(null);
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
        } else if (entity.type == 'repo') {
            setLoading(true);
            setUser(null);
            const url = `/repo/${entity.name}`;
            fetch(url)
                .then((response) => response.json())
                .then((d) => {
                    setRepo(d)
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
                        <Heading size='sm'><a href={user.html_url}>{user.name}</a></Heading>
                        <Text fontSize='xs'>{user.location}</Text>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Stack mt='6' spacing='1'>
                        <Text>{user.company}</Text>
                        <Text fontSize='sm'>{user.bio}</Text>
                    </Stack>
                </CardFooter>
            </Card>

        );
    }
    if (repo && repo.name) {
        return (
            <Card maxW='sm'>
                <CardBody>
                    <Stack mt='6' spacing='1'>
                        <Heading size='sm'>Repo <a href={repo.html_url}>{repo.full_name}</a></Heading>
                        <Text fontSize='xs'><Badge colorScheme='purple'>{repo.language}</Badge></Text>
                        {repo.topics && repo.topics.map(
                            (t) => <Text fontSize='xs' key={t}><Badge variant='outline' colorScheme='purple'>{t}</Badge></Text>)
                        }
                    </Stack>
                </CardBody>
                <CardFooter>
                    <Stack mt='6' spacing='1'>
                        <Text fontSize='sm'>{repo.description}</Text>
                        {repo.forks_count && <Text fontSize='sm'>{repo.forks_count} forks</Text>}
                        {repo.watchers_count && <Text fontSize='sm'>{repo.watchers_count} watchers</Text>}
                        {repo.stargazers_count && <Text fontSize='sm'>{repo.stargazers_count} stars</Text>}
                    </Stack>
                </CardFooter>
            </Card>

        );
    }
    return (
        <Card maxW='sm'>
            <CardBody>
                    {/* <Text>Select user to view details</Text> */}
            </CardBody>
        </Card>
    );
}
import React, { useEffect, useRef, useState } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useRouter } from 'next/router';
import { Center, Box, Stack, Title, Image, Group, Space, Button, Text, Pill, Badge } from '@mantine/core';



export default function Project() {

    const router = useRouter(); 
    const prj_id = router.query.project

    const connection_url = process.env.NEXT_PUBLIC_ONLYOFFICE_CONNECTION_URL;
    const fileuploader_url = process.env.NEXT_PUBLIC_FILEUPLOADER_URL;
    const onlyoffice_fileupploader_url = process.env.NEXT_PUBLIC_LOCALFILEUPLOADER_URL;

    const [extName, setExtName] = useState("");
    const [prjName, setPrjName] = useState("");
    const [prjDesc, setPrjDesc] = useState("");
    const [userIter, setUserIter] = useState("");
    const [users, setUsers] = useState("");
 
    
        fetch('/api/getProjectById', {
            method: 'post',
            body: JSON.stringify({
                id: parseInt(prj_id)
            })
        }).then(x =>  x.json())
	.then(json => {
		if (json.project != undefined) {
		setPrjName(json.project.name)
		setPrjDesc(json.project.description)
		fetch("/api/getProjectUsers", {
			method: "post",
			body: JSON.stringify({
			   id: parseInt(prj_id)
			})
		}).then(promise => promise.json()).then((x) => {
			  let usors = "Участники: "
			  for (const user of x.users) {
				usors += user + ", "
			  } setUsers(usors)
			 console.log(usors)
			})
		}})
    


    return (
<Center><Stack
      w={900}
      bg="var(--mantine-color-body)"
      align="center"
    >	
	    <Title>{prjName}</Title>
	    <Space />
		<Center><Text align="center">{prjDesc}</Text></Center>
	      
	        {users}	
		<Image src="https://placehold.co/400x50/1A1B1E/f8f9fa?text=Нет картинки" radius="md" />	

	    <Group>
	    <Button onClick={(e) => {router.push('/show?prj_id='+prj_id)}}>Просмотреть презентацию</Button>
	    </Group>
		</Stack></Center>
 		
    )
} 

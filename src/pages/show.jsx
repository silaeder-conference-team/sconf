import React, { useEffect, useRef, useState } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useRouter } from 'next/router';

export default function App() {
    const connection_url = process.env.NEXT_PUBLIC_ONLYOFFICE_CONNECTION_URL;
    const fileuploader_url = process.env.NEXT_PUBLIC_FILEUPLOADER_URL;
    const onlyoffice_fileupploader_url = process.env.NEXT_PUBLIC_LOCALFILEUPLOADER_URL;

    const router = useRouter();
    const prj_id = router.query.prj_id;

    const [extName, setExtName] = useState("");

    useEffect(() => {
        if (prj_id != undefined) {
            fetch(fileuploader_url + '/get-extname?prj_id=' + prj_id)
                .then(response => response.text())
                .then(data => {
                    if (data) {
                        console.log(data);
                        setExtName(data);
                    } else {
                        console.log("No data received");
                    }
                });
        }
    }, [prj_id]);

    return (
        <>
        {extName != "" ?
            <DocumentEditor
                id="docxEditor"
                documentServerUrl={connection_url}
                config={{
                    "document": {
                        "fileType": extName,
                        "key": prj_id,
                        "title": "Presentation",
                        "url": onlyoffice_fileupploader_url +"/get-presentation?prj_id="+prj_id
                    },
                    "editorConfig": {
                        "mode": "view",
                    },
                }}
            /> : <></>}
        </>
    );
}   
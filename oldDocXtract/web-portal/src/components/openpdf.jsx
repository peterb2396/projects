import React, { useEffect, useState } from "react";

const OpenPdf = ({ fileKey }) => {
    const [url, setUrl] = useState('')
    useEffect(() => {
        setUrl(fileKey)
    }, [fileKey])
    // const handlePrint = () => {
    //     window.print();
    // };

    return (
        <div>
            {url !== '' && <iframe title="Pdf" src={url} />}
        </div>
    );
};

export default OpenPdf;
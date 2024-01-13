/* eslint-disable @next/next/no-img-element */
import { DuplicateFile, useDirectoryStore } from "../data";
import { convertFileSrc } from '@/lib/tauri';
import ComparisonWrapper from "./comparisonwrapper";
import Image from 'next/image'
import { useEffect, useState } from "react";

export default function ComparisonImages({comparison}:{comparison: DuplicateFile}) {

    return <div className="flex justify-center" style={{'maxWidth': '98vw'}}>
        {comparison.files.map((file, idx) => {
            return <ComparisonWrapper key={file} file={file} index={idx} count={comparison.count}>
                    <ComparisonImage file={file}/>
            </ComparisonWrapper>;
        })}
    </div>
}

function ComparisonImage({file}:{file:string}) {
    const [path, setPath] = useState("");

    useEffect(() => {
        const loadFile = async () => {
            let filePath = await convertFileSrc(file);
            setPath(filePath);
        };

        loadFile();
    }, [file]);

    if(path === "") {
        return <div></div>
    }

    return <img className="mx-auto" style={{'maxHeight': '50vh'}} alt={file} src={path}/>
}
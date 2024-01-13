import { DuplicateFile, useDirectoryStore } from "../data";
import { convertFileSrc, invoke } from '@/lib/tauri';
import ComparisonWrapper from "./comparisonwrapper";
import { useEffect, useState } from "react";
export default function ComparisonObjects({comparison}:{comparison: DuplicateFile}) {

    return <div className="flex" style={{'maxWidth': '98vw'}}>
        {comparison.files.map((file, idx) => {
            return <ComparisonWrapper key={file} file={file} index={idx} count={comparison.count}>
                <ComparisonText file={file}/>
            </ComparisonWrapper>;
        })}
    </div>
}

function ComparisonText({file}:{file:string}) {
    const [path, setPath] = useState("");

    useEffect(() => {
        invoke<string>('read_file', { path: file}).then((data) => {
            setPath(data);
        }).catch((e) => console.error)
    }, [file]);

    return <textarea className="w-full text-black" rows={10} readOnly={true} value={path}></textarea>
}

function ComparisonObject({file}:{file:string}) {
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

    return <object height={400} className="bg-white w-full" data={path}/>
}
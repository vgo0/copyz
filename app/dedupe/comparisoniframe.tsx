import { DuplicateFile, useDirectoryStore } from "../data";
import { convertFileSrc } from '@/lib/tauri';
import ComparisonWrapper from "./comparisonwrapper";
import { useEffect, useState } from "react";
export default function ComparisonIframes({comparison}:{comparison: DuplicateFile}) {
    

    return <div className="flex" style={{'maxWidth': '98vw'}}>
        {comparison.file.files.map((file, idx) => {
            return <ComparisonWrapper key={file} file={file} index={idx} count={comparison.count}>
                    <ComparisonIframe file={file}/>
                </ComparisonWrapper>;
        })}
    </div>
}

function ComparisonIframe({file}:{file:string}) {
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

    return <iframe className="w-full" height={400} src={path}/>
}
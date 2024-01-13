import React from "react";
import { DuplicateFile, useDirectoryStore } from "../data";

export default function ResultRow({result, index}:{result: DuplicateFile, index: number}) {
    const setComparison = useDirectoryStore((state) => state.SetComparison);
    const deleteFileIndex = useDirectoryStore((state) => state.DeleteFileIndex);
    return <React.Fragment key={result.hash}>
        {result.files.map((file, idx) => {
            return <tr className="border" key={`${result.hash}-${idx}`}>
                {idx === 0 && 
                <td className="border p-1" rowSpan={result.count} title={result.hash}>
                    {result.hash.slice(0,20)}... <button onClick={() => setComparison(result, index)} className='rounded p-2 bg-blue-500'>Compare</button>
                </td>}
                {idx === 0 && <td className="border p-1" rowSpan={result.count}>{result.size}</td>}
                <td className="border p-1" key={`${result.hash}-${idx}`}>{file} 
                    <button onClick={() => deleteFileIndex(index, idx)} className='float-right rounded mx-2 px-1 text-small bg-red-500'>
                            Delete                    
                    </button>
                </td>
            </tr>;
        })}
    </React.Fragment>
}
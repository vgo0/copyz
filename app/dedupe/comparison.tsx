import { useState } from "react";
import { DuplicateFile, useDirectoryStore } from "../data";
import ComparisonImages from "./comparisonimage";
import ComparisonVideos from "./comparisonvideo";
import ComparisonObjects from "./comparisonobject";
import ComparisonIframes from "./comparisoniframe";

export default function Comparison() {
    const comparison = useDirectoryStore((state) => state.Comparison);

    if(!comparison) {
        return <div></div>
    }

    let slot: JSX.Element;
    if(comparison.isImage()) {
        slot = <ComparisonImages comparison={comparison}/>;
    }
    else if(comparison.isVideo()) {
        slot = <ComparisonVideos comparison={comparison}/>;
    }
    else if(comparison.isPDF()) {
        slot = <ComparisonIframes comparison={comparison}/>;
    }
    else {
        slot = <ComparisonObjects comparison={comparison}/>;
    }

    return <ComparisonDetails comparison={comparison}>{slot}</ComparisonDetails>;
}

function ComparisonDetails({ children, comparison }: {children: React.ReactNode, comparison: DuplicateFile}) {
    return <div>
        <div className="text-center">Hash: {comparison.hash}</div>
        <div className="text-center">Size: <span className="text-red-500">{comparison.size} MB</span></div>
        <div className="text-center">
            {comparison.files.map((file, idx) => 
                <div key={file}>File <span className="text-blue-500">{idx+1}</span>: <span className="text-green-500">{file}</span></div>
            )}
        </div>
        {children}
    </div>
}
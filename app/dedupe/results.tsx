import { DuplicateFile, useDirectoryStore } from "../data";
import ResultRow from "./resultrow";

export default function ResultsTable() {
    const results = useDirectoryStore((state) => state.Results);

    if(results.length === 0) {
        return <div>No duplicates found!</div>;
    }

    return <table className="w-full">
        <thead>
            <tr>
                <th>Hash</th>
                <th>Size [MB]</th>
                <th>Files</th>
            </tr>
        </thead>
        <tbody>
            {results.map((result, idx) => {
                return <ResultRow key={`${result.hash}-${result.count}`} index={idx} result={result}/>
            })}
        </tbody>
    </table>
}
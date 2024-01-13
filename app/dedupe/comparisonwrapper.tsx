import { DuplicateFile, useDirectoryStore } from "../data";

export default function ComparisonWrapper({ children, count, file, index }: {children: React.ReactNode, count: number, file: string, index: number}) {
    const deleteComparison = useDirectoryStore((state) => state.DeleteComparison);
    
    return(
        <div className="text-center" style={{'maxWidth': `${100 / count}%`, 'width': `${100 / count}%`}}>
                    <div className="text-ellipsis whitespace-nowrap overflow-hidden p-1" title={file}>
                        {file}
                    </div>
                    <div className="pb-2">
                        <button onClick={() => deleteComparison(index)} className='rounded mx-2 p-1 bg-red-500'>
                            Delete
                        </button>
                    </div>
                    {children}
        </div>
    );
}
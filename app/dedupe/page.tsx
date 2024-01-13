"use client";
import { DuplicateFile, DuplicateFilePrimitive, useDirectoryStore } from '../data';
import Link from 'next/link'
import { invoke } from "@/lib/tauri";
import { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import { stat } from 'fs';
import ResultsTable from './results';
import Spinner from '../spinner';
import Comparison from './comparison';
import next from 'next';
import Help from './help';

enum Status {
  NONE,
  RUNNING,
  DONE
}

export default function Home() {
  const directoriesLength = useDirectoryStore((state) => state.Directories.length);
  const directories = useDirectoryStore((state) => state.Directories);
  const resetComparison = useDirectoryStore((state) => state.Reset);
  const setComparison = useDirectoryStore((state) => state.SetComparison);
  const deleteComparison = useDirectoryStore((state) => state.DeleteComparison);
  const nextComparison = useDirectoryStore((state) => state.NextComparison);
  const setResults = useDirectoryStore((state) => state.SetResults);
  const results = useDirectoryStore((state) => state.Results);
  const [running, setRunning] = useState(Status.NONE);
  const [collapsed, setCollapsed] = useState(false);
  const [help, setHelp] = useState(false);
  
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      console.log(event.key);
      if(event.key == "ArrowRight") {
        nextComparison(1);
      }
      else if(event.key == "ArrowLeft") {
        nextComparison(-1);
      }
      else if(!isNaN(parseInt(event.key))) {
        let del_idx = parseInt(event.key) - 1;
        deleteComparison(del_idx);
      }
      else if(event.key == " ") {
        event.preventDefault();
        event.stopPropagation();
        [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => {
          if(video.paused) {
            video.play();
          }
          else {
            video.pause();
          }
        });
      }
    }
    
    document.addEventListener("keydown", keyDownHandler);

    return () => {document.removeEventListener("keydown", keyDownHandler)};
  }, [nextComparison, deleteComparison]);
  

  const run = (recurse: boolean) => {
    setRunning(Status.RUNNING);
    setResults([]);
    resetComparison();
    invoke<DuplicateFilePrimitive[]>('search_duplicates', { recursive: recurse, directories: directories })
      .then(result => {
        let data: DuplicateFile[] = [];
        result.map((res) => {
          data.push(new DuplicateFile(res));
        });
        setResults(data);
        if(data.length > 0) {
          setComparison(data[0], 0);
        }
        setRunning(Status.DONE);
      })
      .catch(console.error)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      {running === Status.NONE &&
      <div>
        <div className='text-center'><Link href="/"><button className='rounded p-2 bg-blue-500'>Revise Selection</button></Link></div>
        <div className='my-2 text-center'>{directoriesLength} folder(s) selected</div>
        <button onClick={() => run(false)} className='rounded p-2 mx-2 bg-red-500'>Start Search</button>
        <button onClick={() => run(true)} className='rounded p-2 bg-red-500'>Start Recursive Search</button>
      </div>
      }
      {running === Status.RUNNING && <Spinner/>}
      {running === Status.DONE && <div className='"w-full"'>
          <div className='text-center my-2'>
            <button onClick={() => { 
              setRunning(Status.NONE);
              setResults([]);
            }}
            className='rounded p-2 mx-2 bg-blue-500'>Back
            </button>
            <button onClick={() => setCollapsed(!collapsed)}
              className='rounded p-2 mx-2 bg-blue-500'>{`${collapsed ? 'Un-collapse Comparison' : 'Collapse Comparison'}`}
            </button>
            <button onClick={() => setHelp(!help)}
              className='rounded p-2 mx-2 bg-blue-500'>{`${help ? 'Hide Shortcuts' : 'Show Shortcuts'}`}
            </button>
           </div>
           {results.length > 0 && <div className='text-center my-2'>
            <button onClick={() => nextComparison(-1)}
                className='rounded p-2 mx-2 bg-blue-500'>Previous Entry
            </button>
            <button onClick={() => nextComparison(1)}
              className='rounded p-2 mx-2 bg-blue-500'>Next Entry
            </button>
           </div>}
          <div className={!help ? 'hidden' : ''}><Help/></div>
          <div className={collapsed ? 'hidden' : ''}><Comparison/></div>
          <ResultsTable/>
        </div>}
    </main>
  )
}

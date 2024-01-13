import { DuplicateFile, useDirectoryStore } from "../data";
import { convertFileSrc } from '@/lib/tauri';
import ComparisonWrapper from "./comparisonwrapper";
import { useEffect, useState } from "react";
export default function ComparisonVideos({comparison}:{comparison: DuplicateFile}) {

    return <div>
        <VideoControls/>
        <div className="flex justify-center" style={{'maxWidth': '98vw'}}>
            {comparison.files.map((file, idx) => {
                return <ComparisonWrapper key={file} file={file} index={idx} count={comparison.count}>
                        <ComparisonVideo file={file}/>
                    </ComparisonWrapper>;
            })}
        </div>
    </div>
}

function VideoControls() {
    return (<div className="text-center my-2">
                <button onClick={() => [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => video.play())} className='rounded mx-2 p-2 bg-green-500'>
                    Play
                </button>
                <button onClick={() => [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => video.pause())} className='rounded mx-2 p-2 bg-green-500'>
                    Pause
                </button>
                <button onClick={() => [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => video.currentTime = 0)} className='rounded mx-2 p-2 bg-green-500'>
                    Restart
                </button>
                <button onClick={() => [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => video.muted = true)} className='rounded mx-2 p-2 bg-green-500'>
                    Mute
                </button>
                <button onClick={() => [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => video.muted = false)} className='rounded mx-2 p-2 bg-green-500'>
                    Un-Mute
                </button>
                <button onClick={() => [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => video.currentTime -= 15)} className='rounded mx-2 p-2 bg-green-500'>
                    -15 seconds
                </button>
                <button onClick={() => [].forEach.call(document.getElementsByTagName("video"), (video: HTMLVideoElement) => video.currentTime += 15)} className='rounded mx-2 p-2 bg-green-500'>
                    +15 seconds
                </button>
            </div>);
}

function ComparisonVideo({file}:{file:string}) {
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

    return <video className="mx-auto" style={{ 'maxHeight': '50vh'}} controls={true} muted={true} src={path}/>
}
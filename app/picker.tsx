"use client";
import { open } from '@tauri-apps/api/dialog';
// import { appDir } from '@tauri-apps/api/path';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useDirectoryStore } from './data';

export default function DirectoryPicker() {
    const directories = useDirectoryStore((state) => state.Directories);
    const addDirectory = useDirectoryStore((state) => state.Add);
    const addDirectories = useDirectoryStore((state) => state.AddMultiple);
    const removeDirectory = useDirectoryStore((state) => state.Remove);

    const pickDirectories = async() => {
        const selected = await open({
            directory: true,
            multiple: true,
          });

          if (Array.isArray(selected)) {
            addDirectories(selected);
          } else if (selected === null) {
            // user cancelled the selection
          } else {
            addDirectory(selected);
          }
    }

    return (
        <div>
            <button onClick={pickDirectories} className="my-4 bg-gray-300 text-black p-2 rounded">Pick Directories</button>
            {directories.length > 0 && <div>
                {directories.map((directory, idx) => 
                <div className='my-2' key={idx}>{directory} <button onClick={() => { 
                    removeDirectory(idx);
                }} className='float-right rounded bg-red-400 px-1'>Remove</button></div>
                )}
            </div>}
            {directories.length ==  0 && <div className='text-lg'>Please choose at least one directory to check.</div>}
        </div>
    )
}
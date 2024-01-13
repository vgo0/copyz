"use client"
import { create } from 'zustand'
import Comparison from './dedupe/comparison';
import { invoke } from '@/lib/tauri';

export type DuplicateFilePrimitive = {
    original_index: number;
    files: string[];
    hash: string;
    size: number;
}

export class DuplicateFile {
    file: DuplicateFilePrimitive;

    constructor(file: DuplicateFilePrimitive) {
        this.file = file;
    }

    get count(): number {
        return this.file.files.length;
    }

    get files(): string[] {
        return this.file.files;
    }

    get hash(): string {
        return this.file.hash;
    }

    get size(): number {
        return this.file.size;
    }

    isImage(): boolean {
        let result = this.files[0].match(/\.(gif|jpg|jpeg|jfif|pjpeg|pjp|svg|apng|webp|png)$/i);

        if(result) {
            return result.length > 0;
        }

        return false;
    }

    isVideo(): boolean {
        let result = this.files[0].match(/\.(mp4|webm)$/i);

        if(result) {
            return result.length > 0;
        }

        return false;
    }

    isPDF(): boolean {
        return this.files[0].endsWith(".pdf");
    }
}

interface DirectoryData {
    Directories: string[],
    ComparisonIndex: number,
    Results: DuplicateFile[],
    Comparison: DuplicateFile | undefined,
    Reset: () => void,
    SetComparison: (duplicate: DuplicateFile, index: number) => void,
    DeleteComparison: (idx: number) => void,
    Add: (directory: string) => void,
    AddMultiple: (directories: string[]) => void,
    SetResults: (results: DuplicateFile[]) => void,
    Remove: (idx: number) => void,
    NextComparison: (move: number) => void,
    DeleteFileIndex: (resultIdx: number, fileIdx: number) => void,
}

export const useDirectoryStore = create<DirectoryData>()((set, get) => ({
    Directories: [],
    Comparison: undefined,
    Results: [],
    ComparisonIndex: 0,
    NextComparison: (move) => set((state) => {
        let next = state.ComparisonIndex + move;
        if(next >= state.Results.length) {
            next = 0;
        }
        else if(next < 0) {
            next = state.Results.length - 1;
        }

        return { Comparison: state.Results[next], ComparisonIndex: next };
    }),
    SetResults: (results) => set((state) => {
        return {Results: results};
    }),
    DeleteFileIndex: (resultIdx, fileIdx) => {
        if(resultIdx == get().ComparisonIndex) {
            get().DeleteComparison(fileIdx);
            return;
        }
        let results = get().Results;
        if(resultIdx < 0 || resultIdx >= results.length) {
            return;
        }
        else if(fileIdx < 0 || fileIdx >= results[resultIdx].count) {
            return;
        }
        else {
            invoke<boolean>('delete_duplicate', { path: results[resultIdx].files[fileIdx] }).then((worked) => {
                if(!worked) {
                    return;
                }

                if(results[resultIdx].count == 2) {
                    results.splice(resultIdx, 1);
                }
                else {
                    results[resultIdx].files.splice(fileIdx, 1);
                }

                set({Results: [...results]});
            }).catch((e) => console.error)
        }
    },
    DeleteComparison: (idx) => {
        let comparison = get().Comparison;
        let comparisonIdx = get().ComparisonIndex;
        let results = get().Results;
        if(!comparison)
            return;

        if(idx >= 0 && idx < comparison.count) {
            invoke<boolean>('delete_duplicate', { path: comparison.files[idx] }).then((worked) => {
                if(worked && comparison) {
                    if(comparison?.count > 2) {
                        results[comparisonIdx].files.splice(idx, 1);
                        let new_results = [...results];
                        let new_comparison = new DuplicateFile(new_results[comparisonIdx].file);
                        set({Comparison: new_comparison, Results: new_results});
                    }
                    else {
                        results.splice(comparisonIdx, 1);
                        if(results.length == 0) {
                            set({Results: [...results], ComparisonIndex: 0, Comparison: undefined});
                        }
                        else if(comparisonIdx == results.length) {
                            set({Results: [...results], ComparisonIndex: 0, Comparison: results[0]});
                        }
                        else {
                            set({Results: [...results], Comparison: results[comparisonIdx]});
                        }
                    }
                }
            }).catch((e) => console.error)
        }
    },
    Reset: () => set((state) => ({Comparison: undefined, ComparisonIndex: 0})),
    SetComparison: (duplicate, index) => set((state) => ({ Comparison: duplicate, ComparisonIndex: index })),
    Add: (directory) => set((state) => {
        state.Directories.push(directory);
        return {Directories: state.Directories}
    }),
    AddMultiple: (directories) => set((state) => {
        let dirs = state.Directories.concat(directories);
        dirs = dirs.filter((dir, idx) => dirs.indexOf(dir) === idx);
        return {Directories: dirs}
    }),
    Remove: (idx) => set((state) => {
        let dirs = state.Directories;
        dirs.splice(idx, 1);
        return {Directories: [...dirs]}
    })
}))
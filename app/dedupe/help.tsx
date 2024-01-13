export default function Help() {
    return <div className="text-center p-2 border border-gray-300 rounded my-2">
        <p><b className="text-green-600">Keyboard Shortcuts</b></p>
        <p><b className="text-green-600">Next entry</b>: Right Arrow →</p>
        <p><b className="text-green-600">Previous entry</b>: Left Arrow ←</p>
        <p><b className="text-green-600">Play / Pause videos</b>: Spacebar</p>
        <p><b className="text-red-600">Delete file</b>: 1, 2, 3, 4...</p>
        <p>Pressing 1 will delete the first file (leftmost), 2 the second, 3 the third and so forth.</p>
        <p>Deletion should use your systems recycle bin if available so files should be recoverable.</p>
    </div>
}
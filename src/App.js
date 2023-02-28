import './App.css';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {useCallback, useEffect, useState} from "react";

function App() {
    const [data, setData] = useState('')
    const [currentEditor, setCurrentEditor] = useState(null)

    const removeLines = useCallback(() => {
        if (!currentEditor) return
        currentEditor.setData(data.replaceAll('<p>&nbsp;</p>', ''))
    }, [currentEditor, data])

    const keydownHandler = useCallback(function (e) {
        if (e.keyCode === 13 && e.ctrlKey) removeLines()
    }, [removeLines])

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        }
    }, [keydownHandler])

    return (
        <div style={{width: "100%", display: "flex"}}>
            <CKEditor
                editor={ClassicEditor}
                data={data}
                onReady={(editor) => {
                    setCurrentEditor(editor)
                }}
                onChange={(event, editor) => {
                    setData(editor.getData())
                }}
            />
            <button onClick={() => {
                removeLines()
            }} style={{marginLeft: "50px", padding: "10px 20px"}}>
                Remove break lines
            </button>
        </div>
    );
}

export default App;

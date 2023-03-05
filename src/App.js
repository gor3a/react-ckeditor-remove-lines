import './App.css';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {useCallback, useEffect, useState} from "react";

const dynamicNumber = '213-927-3700'

function App() {
    const [data, setData] = useState('')
    const [currentEditor, setCurrentEditor] = useState(null)

    const removeLines = useCallback(() => {
        if (!currentEditor) return
        const newData = data.replaceAll('<p>&nbsp;</p>', '')
            .replaceAll(/(\[(h|H)1\])|(\[\/(h|H)1\])/g, '') // replace any [h1]{text}[/h1]
            .replaceAll(/(\[(h|H)2\])|(\[\/(h|H)2\])/g, '')
            .replaceAll(/(\(?\d{0,3}\)?)\S.?\d{0,3}-\d{0,4}\S/g, dynamicNumber)
        currentEditor.setData(newData)
        setData(newData)
    }, [currentEditor, data])

    const keydownHandler = useCallback(async function (e) {
        if (e.keyCode === 13 && e.ctrlKey) {
            await removeLines()
            window.scrollTo({
                top: 0
            })
        }
    }, [removeLines])

    useEffect( () => {
        const blob = new Blob([data], {type: 'text/html'});
        const clipboardItem = new window.ClipboardItem({'text/html': blob});
        navigator.clipboard.write([clipboardItem]).then(null)
    }, [data])

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        }
    }, [keydownHandler])

    return (<div style={{width: "100%", display: "flex"}}>
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
        }} className='remove-btn'>
            Remove break lines
        </button>
    </div>);
}

export default App;

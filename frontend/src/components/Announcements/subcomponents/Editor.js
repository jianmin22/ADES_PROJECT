import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";

const TOOLBAR_OPTIONS = [
    ["bold", "italic", "underline", "strike"],

    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    ['link'],

    [{ size: ["small", false, "large", "huge"] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
];

const Editor = ({ setContent, setText }) => {
    const [quill, setQuill] = useState();

    useEffect(() => {
        const handler = (delta, oldDelta, source) => {
            setText(quill.getText())
            setContent(quill.getContents());
        };

        if (quill) quill.on("text-change", handler);
    }, [quill]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: {
                toolbar: TOOLBAR_OPTIONS,
            },
        });
        q.disable();
        q.setText("Loading...");
        setQuill(q);
        q.setText("");
        q.enable();
    }, []);

    return (
        <div className="flex-grow flex-col w-full h-full items-center justify-between">
            <div className="flex items-center justify-center w-full h-full">
                <div
                    id="quill-container"
                    ref={wrapperRef}
                    className="max-w-3xl h-[256px] w-full"
                ></div>
            </div>
        </div>
    );
};

export default Editor;

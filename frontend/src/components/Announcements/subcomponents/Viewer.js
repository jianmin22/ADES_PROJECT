import { useEffect, useState } from "react";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

function Viewer({ content }) {
    const [htmlContent, setHtmlContent] = useState("");
    useEffect(() => {
        var cfg = {
            inlineStyles: true,
        };

        const Converter = new QuillDeltaToHtmlConverter(content.ops, cfg);
        setHtmlContent(Converter.convert());
    }, [content]);

    return (
        <div className="flex items-center justify-center w-full h-full flex-col">
            <div className="mockup-window border bg-base-300 max-w-3xl w-full rounded-b-none"></div>
            <div className="bg-white border shadow-lg max-w-3xl min-h-[256px] max-h-[512px] w-full overflow-auto rounded-lg">
                <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    className="whitespace-normal break-words p-4"
                ></div>
            </div>
        </div>
    );
}

export default Viewer;

import { r as HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";
//#region #nitro/virtual/renderer-template
const rendererTemplate = () => new HTTPResponse("��<\0!\0D\0O\0C\0T\0Y\0P\0E\0 \0h\0t\0m\0l\0>\0<\0h\0t\0m\0l\0 \0l\0a\0n\0g\0=\0\"\0e\0n\0\"\0>\0<\0h\0e\0a\0d\0>\0<\0m\0e\0t\0a\0 \0c\0h\0a\0r\0s\0e\0t\0=\0\"\0U\0T\0F\0-\x008\0\"\0 \0/\0>\0<\0m\0e\0t\0a\0 \0n\0a\0m\0e\0=\0\"\0v\0i\0e\0w\0p\0o\0r\0t\0\"\0 \0c\0o\0n\0t\0e\0n\0t\0=\0\"\0w\0i\0d\0t\0h\0=\0d\0e\0v\0i\0c\0e\0-\0w\0i\0d\0t\0h\0,\0 \0i\0n\0i\0t\0i\0a\0l\0-\0s\0c\0a\0l\0e\0=\x001\0.\x000\0\"\0 \0/\0>\0<\0t\0i\0t\0l\0e\0>\0F\0i\0t\0P\0r\0e\0p\0<\0/\0t\0i\0t\0l\0e\0>\0<\0/\0h\0e\0a\0d\0>\0<\0b\0o\0d\0y\0>\0<\0d\0i\0v\0 \0i\0d\0=\0\"\0r\0o\0o\0t\0\"\0>\0<\0/\0d\0i\0v\0>\0<\0s\0c\0r\0i\0p\0t\0 \0t\0y\0p\0e\0=\0\"\0m\0o\0d\0u\0l\0e\0\"\0 \0s\0r\0c\0=\0\"\0/\0s\0r\0c\0/\0m\0a\0i\0n\0.\0t\0s\0x\0\"\0>\0<\0/\0s\0c\0r\0i\0p\0t\0>\0<\0/\0b\0o\0d\0y\0>\0<\0/\0h\0t\0m\0l\0>\0\r\0\n\0", { headers: { "content-type": "text/html; charset=utf-8" } });
//#endregion
//#region node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
function renderIndexHTML(event) {
	return rendererTemplate(event.req);
}
//#endregion
export { renderIndexHTML as default };

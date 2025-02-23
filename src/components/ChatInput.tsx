import { LuLightbulb, LuGlobe, LuUpload, LuMic } from "react-icons/lu";
import useAppStore from "../appStore";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import WaveSurfer from "wavesurfer.js";

const ChatInput = () => {
	const {
		searchSeleted,
		thinkingSeleted,
		setSearchSeleted,
		setThinkingSeleted,
	} = useAppStore();

	const [message, setMessage] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();
	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		textarea.style.height = "auto";
		const minHeight = 72; // min 3 lines (24px * 3)
		const maxHeight = window.innerHeight / 3;
		const newHeight = Math.min(
			Math.max(textarea.scrollHeight, minHeight),
			maxHeight
		);
		textarea.style.height = `${newHeight}px`;
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter") {
			if (e.ctrlKey) {
				const { selectionStart, selectionEnd } = e.currentTarget;
				const newMessage =
					message.slice(0, selectionStart) + "\n" + message.slice(selectionEnd);
				setMessage(newMessage);
				e.preventDefault();

				// 确保在 DOM 更新后滚动到底部
				setTimeout(() => {
					const textarea = textareaRef.current;
					if (textarea) {
						textarea.scrollTop = textarea.scrollHeight;
					}
				}, 0);
			} else {
				e.preventDefault();
				// 提交 message
				e.currentTarget.value = "";
				setFile(null);
			}
		}
	};

	useEffect(() => {
		adjustHeight();
	}, [message]);

	const [file, setFile] = useState<string | null>(null);
	const handleUploadFile = async () => {
		const file = await open({
			multiple: false,
			directory: false,
		});
		// 识别文件类型
		// 如果是音频文件，则显示音频
		// 如果是图片，则显示图片控件
		// 如果是文档，则显示文档
		// 如果是其他文件，则显示文件名
		setFile(file);
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 py-4"
		>
			<div
				className={`relative rounded-lg border ${
					isFocused
						? "border-blue-500 ring-2 ring-blue-500"
						: "border-gray-300 dark:border-gray-600"
				} transition-all duration-200`}
			>
				<textarea
					ref={textareaRef}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					rows={3}
					placeholder={t("chat.placeholder")}
					className="w-full resize-none rounded-t-lg border-0 px-2 py-0 focus:outline-none dark:bg-gray-800 dark:text-gray-200 min-h-[72px]"
					style={{ maxHeight: `${window.innerHeight / 3}px` }}
				/>
				<div className="flex px-1 py-2 border-t-0">
					<button
						className={`p-1 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 ${
							searchSeleted
								? "text-blue-500 dark:text-blue-500"
								: "text-gray-700 dark:text-gray-100"
						}`}
						title="Network Search"
						onClick={() => setSearchSeleted(!searchSeleted)}
					>
						<LuGlobe className="w-5 h-5" />
						<span className="text-sm">{t("chat.network_search")}</span>
					</button>
					<button
						className={`p-1 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 ${
							thinkingSeleted
								? "text-blue-500 dark:text-blue-500"
								: "text-gray-700 dark:text-gray-100"
						}`}
						title="Thinking"
						onClick={() => setThinkingSeleted(!thinkingSeleted)}
					>
						<LuLightbulb className="w-5 h-5" />
						<span className="text-sm">{t("chat.deep_thinking")}</span>
					</button>

					{file && file.length > 0 ? (
						<div
							className={`p-1 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 text-gray-700 dark:text-gray-100
					}`}
						>
							<div className="text-gray-700 dark:text-gray-100 text-sm">
								{file}
							</div>
						</div>
					) : (
						<button
							className={`p-1 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 text-gray-700 dark:text-gray-100
						}`}
							title="Upload File"
							onClick={handleUploadFile}
						>
							<LuUpload className="w-5 h-5" />
							<span className="text-sm">{t("chat.upload_file")}</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatInput;

import { useCallback, useEffect, useRef, useState, forwardRef } from "react";
import { VariableSizeList as List } from "react-window";

interface VirtualListProps {
	message: any[];
	className?: string; // 新增 className prop
	style?: React.CSSProperties; // 新增 style prop
	rowRenderer: (props: any) => React.ReactNode; // 新增 rowRenderer prop
    callbacks?: Record<string, any>; // 新增 callbacks 属性
}

export const VirtualList = forwardRef(
	({ message, className, style, rowRenderer, callbacks = {} }: VirtualListProps, ref) => {
		const listContainerRef = useRef<HTMLDivElement>(null);
		const [windowHeight, setWindowHeight] = useState(window.innerHeight);
		const listRef = useRef<any>(null);
		const sizeMap = useRef<{ [key: number]: number }>({});
		const getSize = useCallback((index: number) => {
			return sizeMap.current[index] || 70;
		}, []);

		const setSize = useCallback((index: number, size: number) => {
			sizeMap.current[index] = size;
			listRef.current?.resetAfterIndex(index);
		}, []);

		useEffect(() => {
			const handleResize = () => {
				if (listContainerRef.current) {
					setWindowHeight(listContainerRef.current.clientHeight);
					setTimeout(() => {
						if (listRef.current) {
							listRef.current.resetAfterIndex(0, true);
						}
					}, 0);
				}
			};
			window.addEventListener("resize", handleResize);
			handleResize();
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}, []);

		useEffect(() => {
			if (listRef.current && message.length > 0) {
				listRef.current.resetAfterIndex(0, true);
			}
		}, [message]);

		// 将 listRef 暴露给父组件
		useEffect(() => {
			if (ref) {
				if (typeof ref === "function") {
					ref(listRef.current);
				} else {
					ref.current = listRef.current;
				}
			}
		}, [ref]);

		return (
			<div ref={listContainerRef} className={className} style={style}>
				<List
					ref={listRef}
					height={windowHeight}
					itemCount={message.length}
					itemSize={getSize}
					width="100%"
					itemData={{
						items: message,
						setSize,
						...callbacks,
					}}
					overscanCount={5}
				>
					{rowRenderer}
				</List>
			</div>
		);
	}
);
